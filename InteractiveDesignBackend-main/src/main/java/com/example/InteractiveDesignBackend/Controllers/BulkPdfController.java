package com.example.InteractiveDesignBackend.Controllers;

import com.example.InteractiveDesignBackend.Services.BulkPdfJobService;
import com.example.InteractiveDesignBackend.Services.BulkPdfJobService.JobState;
import com.example.InteractiveDesignBackend.Services.BulkPdfJobService.JobStatus;
import com.example.InteractiveDesignBackend.Services.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

/**
 * Three endpoints replace the old single /uploadPdf endpoint:
 *
 *   POST   /api/uploadPdf/submit          — accepts files, returns jobId immediately
 *   GET    /api/uploadPdf/status/{jobId}  — returns job progress (poll this)
 *   GET    /api/uploadPdf/download/{jobId}— streams the ZIP when status == DONE
 */
@RestController
@RequestMapping("/api/uploadPdf")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BulkPdfController {

    private final BulkPdfJobService jobService;
    private final LogService        logService;

    // ------------------------------------------------------------------
    // 1. Submit — returns jobId instantly, processing runs in background
    // ------------------------------------------------------------------

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submit(
            @RequestPart(value = "payload",  required = false) String payload,
            @RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
            @RequestPart(value = "file",     required = false) MultipartFile htmlFile) {

        Date start = new Date();

        if (payload == null || payload.isBlank()) payload = "[]";

        if (files == null || files.length == 0) {
            logService.logActivity("FAILURE", "No JSON files", start);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "JSON file(s) not selected"));
        }

        if (htmlFile == null || htmlFile.isEmpty()) {
            logService.logActivity("FAILURE", "No HTML file", start);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "HTML file not selected"));
        }

        try {
            String jobId = jobService.submitJob(payload, files, htmlFile);

            logService.logActivity("QUEUED",
                    "Bulk PDF job " + jobId + " queued with "
                            + files.length + " files", start);

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("jobId",   jobId);
            resp.put("total",   files.length);
            resp.put("message", "Job accepted. Poll /status/" + jobId
                    + " for progress.");
            return ResponseEntity.accepted().body(resp);

        } catch (Exception ex) {
            logService.logActivity("FAILURE", ex.getMessage(), start);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // 2. Status — lightweight poll; client calls this every few seconds
    // ------------------------------------------------------------------

    @GetMapping("/status/{jobId}")
    public ResponseEntity<Map<String, Object>> status(
            @PathVariable String jobId) {

        JobState state = jobService.getJobState(jobId);
        if (state == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(state.toMap());
    }

    // ------------------------------------------------------------------
    // 3. Download — available only when status == DONE
    // ------------------------------------------------------------------

    @GetMapping("/download/{jobId}")
    public ResponseEntity<FileSystemResource> download(
            @PathVariable String jobId) {

        JobState state = jobService.getJobState(jobId);

        if (state == null) {
            return ResponseEntity.notFound().build();
        }
        if (state.status != JobStatus.DONE) {
            // 409 Conflict — job not ready yet
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        File zip = new File(state.zipPath);
        if (!zip.exists()) {
            return ResponseEntity.status(HttpStatus.GONE).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData(
                "attachment", jobId + ".zip");
        headers.setContentLength(zip.length());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new FileSystemResource(zip));
    }
}