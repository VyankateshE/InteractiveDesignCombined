package com.example.InteractiveDesignBackend.Services;

import com.example.InteractiveDesignBackend.Entity.RecordEntity;
import com.example.InteractiveDesignBackend.Repositor.RecordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.zip.*;

/**
 * Handles bulk PDF generation for thousands of JSON files.
 *
 * Architecture:
 *  - Each upload request creates a Job with a unique jobId.
 *  - Files are split into batches of BATCH_SIZE.
 *  - A fixed thread pool processes batches concurrently.
 *  - A Semaphore limits concurrent calls to the Node/Puppeteer service
 *    so it is never overwhelmed regardless of how many threads are running.
 *  - Each generated PDF is written directly to a temp directory on disk
 *    (never accumulated in a single in-memory Map).
 *  - When all batches finish, the temp files are streamed into a ZIP on disk,
 *    then the temp files are deleted.
 *  - The client polls GET /api/uploadPdf/status/{jobId} and, when DONE,
 *    downloads GET /api/uploadPdf/download/{jobId}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BulkPdfJobService {

    // ---------------------------------------------------------------
    // Tuning constants — adjust to your server's CPU / Node capacity
    // ---------------------------------------------------------------

    /** How many JSON files per batch. 50 is a safe default. */
    private static final int BATCH_SIZE = 50;

    /**
     * Max threads processing batches. Keep this ≤ the number of CPU cores
     * available to the JVM. More threads than cores wastes context-switch time.
     */
    private static final int THREAD_POOL_SIZE = 8;

    /**
     * Max simultaneous HTTP calls to the Node/Puppeteer service.
     * Puppeteer spawns a browser tab per request — 10 concurrent is plenty
     * for most machines; increase only if your Node host has headroom.
     */
    private static final int MAX_CONCURRENT_NODE_CALLS = 10;

    /** Where temp PDFs and final ZIPs are written. */
    private static final String OUTPUT_BASE = "bulk_pdf_jobs" + File.separator;

    private static final String NODE_PDF_URL =
            "http://localhost:3010/api/v1/s3Upload/uploadHTML5";

    // ---------------------------------------------------------------

    private final RecordRepository repository;
    private final LogService logService;
    private final ObjectMapper mapper = new ObjectMapper();

    /** Gate that limits how many threads can call Node at once. */
    private final Semaphore nodeSemaphore =
            new Semaphore(MAX_CONCURRENT_NODE_CALLS, true);

    /** One RestTemplate shared across all threads (thread-safe). */
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Dedicated thread pool.  We create it here rather than using Spring's
     * default @Async executor so we have explicit control over pool size.
     */
    private final ExecutorService executor =
            Executors.newFixedThreadPool(THREAD_POOL_SIZE);

    // ---------------------------------------------------------------
    // Job state — kept in memory; replace with DB/Redis for multi-node
    // ---------------------------------------------------------------

    public enum JobStatus { QUEUED, PROCESSING, DONE, FAILED }

    public static class JobState {
        public final String jobId;
        public volatile JobStatus status = JobStatus.QUEUED;
        public volatile String message = "Queued";
        public final AtomicInteger processed = new AtomicInteger(0);
        public final AtomicInteger failed   = new AtomicInteger(0);
        public volatile int total = 0;
        /** Absolute path to the final ZIP once status == DONE. */
        public volatile String zipPath;

        public JobState(String jobId) { this.jobId = jobId; }

        public Map<String, Object> toMap() {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("jobId",     jobId);
            m.put("status",    status.name());
            m.put("message",   message);
            m.put("processed", processed.get());
            m.put("failed",    failed.get());
            m.put("total",     total);
            return m;
        }
    }

    private final ConcurrentHashMap<String, JobState> jobs =
            new ConcurrentHashMap<>();

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    /**
     * Submits a bulk PDF job and returns its jobId immediately.
     * All real work happens asynchronously in the thread pool.
     */
    public String submitJob(
            String payloadJson,
            MultipartFile[] files,
            MultipartFile htmlFile) throws IOException {

        String jobId = UUID.randomUUID().toString();
        JobState state = new JobState(jobId);
        state.total = files.length;
        jobs.put(jobId, state);

        // Read everything into byte[] BEFORE handing off to async context,
        // because MultipartFile streams are only valid during the HTTP request.
        byte[] htmlBytes = htmlFile.getBytes();
        List<byte[]> fileBytesList = new ArrayList<>(files.length);
        for (MultipartFile f : files) {
            fileBytesList.add(f.getBytes());
        }

        // Kick off async processing — returns immediately to the caller.
        processAsync(jobId, payloadJson, fileBytesList, htmlBytes);

        return jobId;
    }

    /** Returns the current state of a job (safe to call from any thread). */
    public JobState getJobState(String jobId) {
        return jobs.get(jobId);
    }

    /**
     * Returns the path to the completed ZIP file.
     * Returns null if the job is not finished or not found.
     */
    public String getZipPath(String jobId) {
        JobState state = jobs.get(jobId);
        if (state == null || state.status != JobStatus.DONE) return null;
        return state.zipPath;
    }

    // ---------------------------------------------------------------
    // Async processing
    // ---------------------------------------------------------------

    @Async
    protected void processAsync(
            String jobId,
            String payloadJson,
            List<byte[]> fileBytesList,
            byte[] htmlBytes) {

        JobState state = jobs.get(jobId);
        state.status  = JobStatus.PROCESSING;
        state.message = "Processing";

        try {
            // 1. Parse payload once — shared across all threads (read-only).
            ParsedPayload payload = parsePayload(payloadJson);

            // 2. Create a temp directory for this job's individual PDF files.
            Path jobDir = Path.of(OUTPUT_BASE + jobId);
            Files.createDirectories(jobDir);

            // 3. Split files into batches and submit each batch to the pool.
            List<Future<?>> futures = new ArrayList<>();
            List<List<byte[]>> batches = partition(fileBytesList, BATCH_SIZE);

            for (List<byte[]> batch : batches) {
                futures.add(executor.submit(() ->
                        processBatch(batch, payload, htmlBytes, jobDir, state)));
            }

            // 4. Wait for ALL batches to complete.
            for (Future<?> f : futures) {
                try {
                    f.get();        // propagates batch exceptions
                } catch (ExecutionException ex) {
                    log.warn("[{}] Batch error: {}", jobId, ex.getMessage());
                    // Don't abort — allow other batches to continue.
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Job interrupted", ex);
                }
            }

            // 5. Stream all PDFs from disk into a single ZIP on disk.
            String zipPath = OUTPUT_BASE + jobId + ".zip";
            streamDirectoryToZip(jobDir, Path.of(zipPath));

            // 6. Clean up individual PDF temp files.
            deleteDirectory(jobDir);

            state.zipPath = zipPath;
            state.status  = JobStatus.DONE;
            state.message = state.processed.get() + " PDFs generated"
                    + (state.failed.get() > 0
                       ? ", " + state.failed.get() + " failed"
                       : "");

            logService.logActivity("SUCCESS", state.message, new Date());

        } catch (Exception ex) {
            state.status  = JobStatus.FAILED;
            state.message = "Job failed: " + ex.getMessage();
            log.error("[{}] Job failed: {}", jobId, ex.getMessage(), ex);
            logService.logActivity("FAILURE", state.message, new Date());
        }
    }

    // ---------------------------------------------------------------
    // Batch processing
    // ---------------------------------------------------------------

    /**
     * Processes one batch of JSON files.
     * Each file generates exactly one PDF, written to jobDir/{fileName}.pdf.
     * Errors on individual files are logged and counted — they do NOT abort
     * the batch, so one bad file cannot block 9,999 good ones.
     */
    private void processBatch(
            List<byte[]> batch,
            ParsedPayload payload,
            byte[] htmlBytes,
            Path jobDir,
            JobState state) {

        String htmlContent = new String(htmlBytes, StandardCharsets.UTF_8)
                .replaceFirst("^\uFEFF", "");

        for (byte[] fileBytes : batch) {
            try {
                generateSinglePdf(fileBytes, payload, htmlContent, jobDir);
                state.processed.incrementAndGet();
            } catch (Exception ex) {
                state.failed.incrementAndGet();
                log.warn("[{}] File error: {}", state.jobId, ex.getMessage());
            }
        }
    }

    /**
     * Generates one PDF from one JSON file.
     * Acquires a semaphore permit before calling Node so the Puppeteer
     * service is never hit by more than MAX_CONCURRENT_NODE_CALLS at once.
     */
    private void generateSinglePdf(
            byte[] fileBytes,
            ParsedPayload payload,
            String htmlContent,
            Path jobDir) throws Exception {

        JsonNode dataJson = mapper.readTree(fileBytes);

        Iterator<Map.Entry<String, JsonNode>> users = dataJson.fields();
        if (!users.hasNext()) return;

        Map.Entry<String, JsonNode> entry = users.next();
        String   userKey  = entry.getKey();
        JsonNode userNode = entry.getValue();

        Map<String, JsonNode> normalizedFieldMap = new HashMap<>();
        normalizedFieldMap.put(userKey.toLowerCase(), userNode);
        userNode.fieldNames().forEachRemaining(field ->
                normalizedFieldMap.put(field.toLowerCase(), userNode.get(field)));

        Document doc = Jsoup.parse(htmlContent);
        AtomicBoolean hasData = new AtomicBoolean(false);

        payload.htmlIdToJsonField.forEach((id, nodeRef) -> {
            if (!nodeRef.isTextual()) return;
            String fieldRef = nodeRef.asText();
            String fullPath = fieldRef.startsWith(userKey + ".")
                    ? fieldRef : userKey + "." + fieldRef;
            String value = resolveField(normalizedFieldMap, fullPath);
            Element elem = doc.getElementById(id);
            if (elem != null && value != null && !value.isEmpty()) {
                elem.text(value);
                hasData.set(true);
            }
        });

        // Determine output file name.
        String fileType = "file_" + UUID.randomUUID();
        if (!payload.fileNameFields.isEmpty()) {
            for (String fnExpr : payload.fileNameFields) {
                String val = resolveField(normalizedFieldMap,
                        userKey + "." + fnExpr.trim());
                if (val != null && !val.isEmpty()) { fileType = val; break; }
            }
        }

        // ---- Call Node/Puppeteer — throttled by semaphore ----
        byte[] pdfBytes;
        nodeSemaphore.acquire();
        try {
            pdfBytes = callNodePuppeteer(
                    doc, fileType, dataJson, payload.pageSize, payload.orientation);
        } finally {
            nodeSemaphore.release();
        }

        // ---- Optional password protection ----
        if (!payload.passwordFields.isEmpty()) {
            String pw = buildPassword(payload.passwordFields,
                    normalizedFieldMap, userKey);
            if (pw != null && !pw.isEmpty()) {
                pdfBytes = protectPdf(pdfBytes, pw);
            }
        }

        // ---- Write PDF to disk (not to memory map) ----
        Path outPath = jobDir.resolve(fileType + ".pdf");
        Files.write(outPath, pdfBytes);

        repository.save(RecordEntity.builder()
                .fileName(fileType + ".pdf").build());
    }

    // ---------------------------------------------------------------
    // Node/Puppeteer HTTP call
    // ---------------------------------------------------------------

    private byte[] callNodePuppeteer(
            Document doc,
            String name,
            JsonNode dataJson,
            String pageSize,
            String orientation) throws IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        byte[] htmlBytes = doc.outerHtml().getBytes(StandardCharsets.UTF_8);
        body.add("file", new ByteArrayResource(htmlBytes) {
            @Override public String getFilename() { return "template.html"; }
        });
        body.add("name", name);
        body.add("chartData", mapper.writeValueAsString(dataJson));

        Map<String, Object> pdfConfig = new HashMap<>();
        pdfConfig.put("pageSize",    pageSize);
        pdfConfig.put("orientation", orientation);
        body.add("payload", mapper.writeValueAsString(pdfConfig));

        ResponseEntity<byte[]> response = restTemplate.exchange(
                NODE_PDF_URL,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                byte[].class);

        byte[] result = response.getBody();
        if (result == null || result.length == 0) {
            throw new IOException("Node returned empty PDF for: " + name);
        }
        return result;
    }

    // ---------------------------------------------------------------
    // PDF password protection
    // ---------------------------------------------------------------

    private byte[] protectPdf(byte[] pdfBytes, String password)
            throws IOException {
        try (PDDocument document = PDDocument.load(pdfBytes);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            AccessPermission perms = new AccessPermission();
            StandardProtectionPolicy policy =
                    new StandardProtectionPolicy(password, password, perms);
            policy.setEncryptionKeyLength(128);
            policy.setPermissions(perms);
            document.protect(policy);
            document.save(out);
            return out.toByteArray();
        }
    }

    private String buildPassword(
            List<String> passwordFields,
            Map<String, JsonNode> normalizedFieldMap,
            String userKey) {

        StringBuilder sb = new StringBuilder();
        for (String pwExpr : passwordFields) {
            String val;
            if (pwExpr.contains(".")) {
                val = resolveField(normalizedFieldMap,
                        userKey + "." + pwExpr.trim());
            } else {
                val = pwExpr.trim();
            }
            if (val != null) sb.append(val.trim());
        }
        return sb.toString().trim();
    }

    // ---------------------------------------------------------------
    // ZIP streaming — writes directly to disk, never into a byte[]
    // ---------------------------------------------------------------

    /**
     * Walks jobDir and writes every .pdf file into a ZIP at zipPath.
     * Files are streamed one at a time — memory usage is proportional
     * to the largest single PDF, not the total size of all PDFs.
     */
    private void streamDirectoryToZip(Path dir, Path zipPath) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(
                new BufferedOutputStream(Files.newOutputStream(zipPath),
                        64 * 1024))) {

            try (var stream = Files.walk(dir)) {
                stream.filter(p -> p.toString().endsWith(".pdf"))
                        .forEach(pdf -> {
                            try {
                                zos.putNextEntry(new ZipEntry(
                                        pdf.getFileName().toString()));
                                Files.copy(pdf, zos);
                                zos.closeEntry();
                            } catch (IOException ex) {
                                log.warn("Could not add {} to ZIP: {}",
                                        pdf, ex.getMessage());
                            }
                        });
            }
        }
    }

    // ---------------------------------------------------------------
    // Payload parsing (done once, shared read-only)
    // ---------------------------------------------------------------

    private ParsedPayload parsePayload(String payloadJson) throws IOException {
        JsonNode payloadNode = mapper.readTree(payloadJson);

        ParsedPayload p = new ParsedPayload();

        JsonNode mappingNode;
        if (payloadNode.isArray()) {
            mappingNode = payloadNode;
        } else if (payloadNode.has("mapping")) {
            mappingNode = payloadNode.get("mapping");
            if (payloadNode.has("pageSize"))
                p.pageSize = payloadNode.get("pageSize").asText();
            if (payloadNode.has("orientation"))
                p.orientation = payloadNode.get("orientation").asText();
        } else {
            throw new IllegalArgumentException("Invalid payload format.");
        }

        for (JsonNode obj : mappingNode) {
            obj.fields().forEachRemaining(e ->
                    p.htmlIdToJsonField.put(e.getKey(), e.getValue()));
        }

        JsonNode fnNode = p.htmlIdToJsonField.get("file_name");
        if (fnNode != null) {
            if (fnNode.isTextual())
                p.fileNameFields.addAll(Arrays.asList(fnNode.asText().split(",")));
            else if (fnNode.isArray())
                fnNode.forEach(n -> p.fileNameFields.add(n.asText()));
        }

        JsonNode pwNode = p.htmlIdToJsonField.get("password");
        if (pwNode != null) {
            if (pwNode.isTextual())
                p.passwordFields.addAll(Arrays.asList(pwNode.asText().split(",")));
            else if (pwNode.isArray())
                pwNode.forEach(n -> p.passwordFields.add(n.asText()));
        }

        return p;
    }

    private static class ParsedPayload {
        final Map<String, JsonNode> htmlIdToJsonField = new LinkedHashMap<>();
        final List<String> fileNameFields  = new ArrayList<>();
        final List<String> passwordFields  = new ArrayList<>();
        String pageSize    = "A4";
        String orientation = "portrait";
    }

    // ---------------------------------------------------------------
    // Utilities
    // ---------------------------------------------------------------

    /** Splits a list into sub-lists of at most size n. */
    private static <T> List<List<T>> partition(List<T> list, int size) {
        List<List<T>> parts = new ArrayList<>();
        for (int i = 0; i < list.size(); i += size) {
            parts.add(list.subList(i, Math.min(i + size, list.size())));
        }
        return parts;
    }

    private void deleteDirectory(Path dir) throws IOException {
        try (var stream = Files.walk(dir)) {
            stream.sorted(Comparator.reverseOrder())
                  .forEach(p -> {
                      try { Files.delete(p); }
                      catch (IOException ex) {
                          log.warn("Could not delete temp file {}: {}", p, ex.getMessage());
                      }
                  });
        }
    }

    /**
     * Resolves a dot-path like "user.address.city" or "user.dob[2,4]"
     * against the normalizedFieldMap.  Copied verbatim from the original
     * RecordService so behaviour is identical.
     */
    private String resolveField(
            Map<String, JsonNode> normalizedFieldMap,
            String expression) {

        if (expression == null || expression.isEmpty()) return null;
        try {
            String[] parts = expression.split("\\.");
            JsonNode current = null;
            if (normalizedFieldMap.containsKey(parts[0].toLowerCase())) {
                current = normalizedFieldMap.get(parts[0].toLowerCase());
            }
            for (int i = 1; i < parts.length && current != null; i++) {
                String part = parts[i];
                if (part.contains("[")) {
                    String field = part.substring(0, part.indexOf("["));
                    JsonNode arr = current.get(field);
                    if (arr == null) return null;
                    String idxPart = part.substring(
                            part.indexOf("[") + 1, part.indexOf("]"));
                    String[] indexes = idxPart.split(",");
                    StringBuilder sb = new StringBuilder();
                    if (arr.isValueNode()) {
                        String val = arr.asText().trim().replaceAll("[-_/]", "");
                        for (String idx : indexes) {
                            try {
                                int n = Integer.parseInt(idx.trim());
                                if (n >= 0 && n < val.length())
                                    sb.append(val.charAt(n));
                            } catch (NumberFormatException ignore) {}
                        }
                        return sb.toString();
                    } else if (arr.isArray()) {
                        int n = Integer.parseInt(indexes[0].trim());
                        current = (n >= 0 && n < arr.size()) ? arr.get(n) : null;
                    }
                } else {
                    current = current.get(part);
                }
            }
            if (current == null && expression.contains("[")) {
                String field = expression.substring(
                        0, expression.indexOf("[")).trim().toLowerCase();
                JsonNode node = normalizedFieldMap.get(field);
                if (node != null && node.isTextual()) {
                    String val = node.asText().trim().replaceAll("[-_/]", "");
                    String idxPart = expression.substring(
                            expression.indexOf("[") + 1, expression.indexOf("]"));
                    StringBuilder sb = new StringBuilder();
                    for (String idx : idxPart.split(",")) {
                        try {
                            int n = Integer.parseInt(idx.trim());
                            if (n >= 0 && n < val.length()) sb.append(val.charAt(n));
                        } catch (NumberFormatException ignore) {}
                    }
                    return sb.toString();
                }
            }
            return (current != null && current.isValueNode())
                    ? current.asText() : null;
        } catch (Exception e) {
            log.warn("Resolver error for [{}]: {}", expression, e.getMessage());
            return null;
        }
    }
}