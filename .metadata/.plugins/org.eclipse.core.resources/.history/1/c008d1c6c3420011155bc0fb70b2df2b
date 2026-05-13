package com.example.InteractiveDesignBackend.Services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.InteractiveDesignBackend.Mypath;
import com.example.InteractiveDesignBackend.Dto.RequestDTO;
import com.example.InteractiveDesignBackend.Entity.LogData;
import com.example.InteractiveDesignBackend.Entity.RecordEntity;
import com.example.InteractiveDesignBackend.Repositor.LogBookRepo;
import com.example.InteractiveDesignBackend.Repositor.RecordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Service
public class RecordService {

	@Autowired
	private RecordRepository repository;

	@Autowired
	private LogBookRepo logRepository;

	@Autowired
	private LogService logService;
	
	
	
	
	public List<String> SingleHtmlToPdf(MultipartFile htmlFile) throws IOException {

	    String outputDir = "output/";
	    Files.createDirectories(Path.of(outputDir));

	    List<String> pdfPaths = new ArrayList<>();
	    RestTemplate restTemplate = new RestTemplate();

	    String pdfFileName = outputDir + UUID.randomUUID() + ".pdf";

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

	    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
	    body.add("file", new ByteArrayResource(htmlFile.getBytes()) {
	        @Override
	        public String getFilename() {
	            return htmlFile.getOriginalFilename();
	        }
	    });

	    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

	    String apiUrl = "http://192.168.0.188:3010/api/v1/s3Upload/uploadHtmlSinglePage";
//	    String apiUrl = "http://api.ariantechsolutions.in/interactive-server/api/v1/s3Upload/uploadHtmlSinglePage";

	    try {

	    	ResponseEntity<byte[]> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, byte[].class);

			if (response.getBody() == null || response.getBody().length == 0) {

			    logService.logActivity(
			            "FAILURE",
			            "Error while calling remote API",
			            new Date()
			    );

			    throw new IOException("Error API returned empty response");
			}

			// Save on success
			Files.write(Path.of(pdfFileName), response.getBody());
			pdfPaths.add(pdfFileName);

	    } catch (Exception ex) {

	        logService.logActivity(
	                "ERROR",
	                "Error while calling remote API: " + ex.getMessage(),
	                new Date()
	        );

	        throw new IOException("Error API call failed: " + ex.getMessage());
	    }

	    return pdfPaths;
	}



	public List<String> processAndGeneratePdf(MultipartFile htmlFile, String payload)
	        throws IOException {

	    String outputDir = "output/";
	    Files.createDirectories(Path.of(outputDir));

	    List<String> pdfPaths = new ArrayList<>();
	    RestTemplate restTemplate = new RestTemplate();

	    String pdfFileName = outputDir + UUID.randomUUID() + ".pdf";

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

	    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

	    body.add("file", new ByteArrayResource(htmlFile.getBytes()) {
	        @Override
	        public String getFilename() {
	            return htmlFile.getOriginalFilename();
	        }
	    });

	    body.add("payload", payload);

	    HttpEntity<MultiValueMap<String, Object>> requestEntity =
	            new HttpEntity<>(body, headers);

	    String apiUrl = "http://localhost:3010/api/v1/s3Upload/uploadNoramlPdf";

	    try {

	        ResponseEntity<byte[]> response =
	                restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, byte[].class);

	        if (response.getBody() == null || response.getBody().length == 0) {

	            logService.logActivity("FAILURE","Empty response from Node", new Date());

	            throw new IOException("Node returned empty PDF");
	        }

	        Files.write(Path.of(pdfFileName), response.getBody());
	        pdfPaths.add(pdfFileName);

	    } catch (Exception ex) {

	        logService.logActivity("ERROR",
	                "Node API error: " + ex.getMessage(),
	                new Date());

	        throw new IOException("Remote API failed");
	    }

	    return pdfPaths;
	}
	
	// ---------------------- SERVICE IMPLEMENTATION ----------------------
	public List<String> processAndGeneratePdf(String payloadJson, MultipartFile[] files, MultipartFile htmlFile)
			throws IOException {

		Date startTime = new Date();
		ObjectMapper mapper = new ObjectMapper();
		JsonNode payloadNode = mapper.readTree(payloadJson);

		JsonNode mappingNode;
		String pageSize = "A4";
		String orientation = "portrait";

		if (payloadNode.isArray()) {
			mappingNode = payloadNode;
		} else if (payloadNode.has("mapping")) {
			mappingNode = payloadNode.get("mapping");
			if (payloadNode.has("pageSize"))
				pageSize = payloadNode.get("pageSize").asText();
			if (payloadNode.has("orientation"))
				orientation = payloadNode.get("orientation").asText();
		} else {
			throw new IllegalArgumentException("Invalid payload format. Must contain 'mapping' or be an array.");
		}

		Map<String, JsonNode> htmlIdToJsonField = new LinkedHashMap<>();
		for (JsonNode obj : mappingNode) {
			obj.fields().forEachRemaining(entry -> htmlIdToJsonField.put(entry.getKey(), entry.getValue()));
		}

		List<String> fileNameFields = new ArrayList<>();
		JsonNode fileNameNode = htmlIdToJsonField.get("file_name");
		if (fileNameNode != null) {
			if (fileNameNode.isTextual())
				fileNameFields.addAll(Arrays.asList(fileNameNode.asText().split(",")));
			else if (fileNameNode.isArray())
				fileNameNode.forEach(n -> fileNameFields.add(n.asText()));
		}

		List<String> passwordFields = new ArrayList<>();
		JsonNode passwordNode = htmlIdToJsonField.get("password");
		if (passwordNode != null) {
			if (passwordNode.isTextual())
				passwordFields.addAll(Arrays.asList(passwordNode.asText().split(",")));
			else if (passwordNode.isArray())
				passwordNode.forEach(n -> passwordFields.add(n.asText()));
		}

		String htmlContent = new String(htmlFile.getBytes(), StandardCharsets.UTF_8).replaceFirst("^\uFEFF", "");

		String outputDir = Mypath.getPath() + "DownloadHTMLANDPDF" + File.separator;
		Files.createDirectories(Path.of(outputDir));
		List<String> pdfPaths = new ArrayList<>();

		RestTemplate restTemplate = new RestTemplate();

		for (MultipartFile file : files) {
			JsonNode dataJson = mapper.readTree(file.getInputStream());
			boolean anyMatchFound = false;

			for (Iterator<Map.Entry<String, JsonNode>> users = dataJson.fields(); users.hasNext();) {
				Map.Entry<String, JsonNode> entry = users.next();
				JsonNode userNode = entry.getValue();

				for (JsonNode nodeRef : htmlIdToJsonField.values()) {
					if (nodeRef.isTextual()) {
						String refField = nodeRef.asText();
						String cleanField = refField.contains(".") ? refField.split("\\.")[1] : refField;
						if (userNode.has(cleanField)) {
							anyMatchFound = true;
							break;
						}
					}
				}
				if (anyMatchFound)
					break;
			}

//			if (!anyMatchFound) {
//				System.out.println(
//						"⚠️ Skipping JSON file '" + file.getOriginalFilename() + "' — no matching data found.");
//				logService.logActivity("SKIPPED",
//						"Skipped JSON file '" + file.getOriginalFilename() + "' — no matching data found.", startTime);
//				continue;
//			}

			for (Iterator<Map.Entry<String, JsonNode>> users = dataJson.fields(); users.hasNext();) {
				Map.Entry<String, JsonNode> entry = users.next();
				String userKey = entry.getKey();
				JsonNode userNode = entry.getValue();

				Map<String, JsonNode> normalizedFieldMap = new HashMap<>();
				normalizedFieldMap.put(userKey.toLowerCase(), userNode);
				userNode.fieldNames()
						.forEachRemaining(field -> normalizedFieldMap.put(field.toLowerCase(), userNode.get(field)));

				Document doc = Jsoup.parse(htmlContent);
				AtomicBoolean hasValidData = new AtomicBoolean(false);
				doc.outputSettings().syntax(Document.OutputSettings.Syntax.xml);

				htmlIdToJsonField.forEach((id, nodeRef) -> {
					String fieldRef = nodeRef.isTextual() ? nodeRef.asText() : null;
					if (fieldRef == null)
						return;
					String fullPath = fieldRef;
					if (!fieldRef.startsWith(userKey + ".")) {
						fullPath = userKey + "." + fieldRef;
					}

					String value = resolveFieldValueWithIndexes(normalizedFieldMap, fullPath.trim());
					Element elem = doc.getElementById(id);
//					if (elem != null && value != null && !value.isEmpty()) {
//						elem.text(value);
//					}
					
					  if (elem != null) {
					        if (value != null && !value.isEmpty()) {
					            elem.text(value);
					            hasValidData.set(true); 
					        }
					    }
					  
					  
				});

				if (!hasValidData.get()) {
				    System.out.println("⚠️ Skipping user " + userKey + " — no valid mapped data found");
//				    continue;
				}
				
				String fileType;
				if (!fileNameFields.isEmpty()) {
					StringBuilder fnBuilder = new StringBuilder();
					for (String fnExpr : fileNameFields) {
						String fnValue = resolveFieldValueWithIndexes(normalizedFieldMap,
								userKey + "." + fnExpr.trim());
						if (fnValue != null && !fnValue.isEmpty())
							fnBuilder.append(fnValue);
						else
							fnBuilder.append("file_").append(UUID.randomUUID()).append("_");
					}
					fileType = fnBuilder.toString().replaceAll("_$", "");
				} else {
					fileType = "file_" + userKey + "_" + UUID.randomUUID();
				}

				String pdfFileName = outputDir + fileType + ".pdf";

				try {
					HttpHeaders headers = new HttpHeaders();
					headers.setContentType(MediaType.MULTIPART_FORM_DATA);

					MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
					
					String chartDataJson = mapper.writeValueAsString(dataJson);

					String debugHtmlPath = "C:/temp/debug_template.html";
					Files.write(Path.of(debugHtmlPath), doc.outerHtml().getBytes(StandardCharsets.UTF_8));
					System.out.println("DEBUG HTML SAVED AT: " + debugHtmlPath);
					
					body.add("file", new ByteArrayResource(doc.outerHtml().getBytes(StandardCharsets.UTF_8)) {
						@Override
						public String getFilename() {
							return "template.html";
						}
					});
					body.add("name", fileType);
					body.add("chartData", chartDataJson);  // ✅ ADD THIS LINE

					Map<String, Object> pdfConfig = new HashMap<>();
					pdfConfig.put("pageSize", pageSize);
					pdfConfig.put("orientation", orientation);
					body.add("payload", mapper.writeValueAsString(pdfConfig));
//					body.add("chartData", mapper.writeValueAsString(dataJson));
					HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
					String apiUrl = "http://192.168.0.188:3010/api/v1/s3Upload/uploadHTML5";
//					String apiUrl = "http://api.ariantechsolutions.in/interactive-server/api/v1/s3Upload/uploadHTML5";

					ResponseEntity<byte[]> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity,
							byte[].class);
				    if (response.getBody() == null || response.getBody().length == 0) {

				        logService.logActivity(
				                "FAILURE",
					            "Error while calling remote API",
				                new Date()
				        );

				        throw new IOException("Error API returned no PDF for " + fileType);
				    }

				    Files.write(Path.of(pdfFileName), response.getBody());

				}catch (Exception ex) {

				    logService.logActivity(
				            "ERROR",
			                "Error while calling remote API: " + ex.getMessage(),
				            new Date()
				    );

			        throw new IOException("Error API call failed");
				}

				if (!passwordFields.isEmpty()) {
					StringBuilder pwBuilder = new StringBuilder();
					for (String pwExpr : passwordFields) {
						String pwValue = resolveFieldValueWithIndexes(normalizedFieldMap,
								userKey + "." + pwExpr.trim());
						pwBuilder.append(pwValue != null ? pwValue : pwExpr.trim());
					}
					String userPassword = pwBuilder.toString();

					System.out.println("---------------------------------------------------");
					System.out.println("Generated PDF for user: " + userKey);
					System.out.println("File Name: " + pdfFileName);
					System.out.println("Password:  " + userPassword);
					System.out.println("Page Size: " + pageSize);
					System.out.println("Orientation: " + orientation);
					System.out.println("---------------------------------------------------");

					try (PDDocument document = PDDocument.load(new File(pdfFileName))) {
						String ownerPassword = UUID.randomUUID().toString();
						AccessPermission permissions = new AccessPermission();
						StandardProtectionPolicy policy = new StandardProtectionPolicy(ownerPassword, userPassword,
								permissions);
						policy.setEncryptionKeyLength(128);
						policy.setPermissions(permissions);
						document.protect(policy);
						document.save(pdfFileName);
					}
				}

				RecordEntity record = RecordEntity.builder().fileName(fileType + ".pdf").build();
				repository.save(record);
				pdfPaths.add(pdfFileName);
			}
		}

		return pdfPaths;
	}

	private String resolveFieldValueWithIndexes(Map<String, JsonNode> normalizedFieldMap, String expression) {
		if (expression == null || expression.isEmpty())
			return null;

		try {
			String[] parts = expression.split("\\.");
			JsonNode currentNode = null;

			if (normalizedFieldMap.containsKey(parts[0].toLowerCase())) {
				currentNode = normalizedFieldMap.get(parts[0].toLowerCase());
			}

			for (int i = 1; i < parts.length && currentNode != null; i++) {
				String part = parts[i];
				if (part.contains("[")) {
					String field = part.substring(0, part.indexOf("["));
					JsonNode arrayNode = currentNode.get(field);

					if (arrayNode == null)
						return null;

					String indexPart = part.substring(part.indexOf("[") + 1, part.indexOf("]"));
					String[] indexes = indexPart.split(",");
					StringBuilder valBuilder = new StringBuilder();

					if (arrayNode.isValueNode()) {
						String value = arrayNode.asText().trim().replaceAll("[-_/]", "");
						for (String idxStr : indexes) {
							try {
								int idx = Integer.parseInt(idxStr.trim());
								if (idx >= 0 && idx < value.length())
									valBuilder.append(value.charAt(idx));
							} catch (NumberFormatException ignore) {
							}
						}
						return valBuilder.toString();
					} else if (arrayNode.isArray()) {
						int idx = Integer.parseInt(indexes[0].trim());
						if (idx >= 0 && idx < arrayNode.size()) {
							currentNode = arrayNode.get(idx);
						} else
							return null;
					}

				} else {
					currentNode = currentNode.get(part);
				}
			}

			if (currentNode == null && expression.contains("[")) {
				String field = expression.substring(0, expression.indexOf("[")).trim().toLowerCase();
				JsonNode node = normalizedFieldMap.get(field);
				if (node != null && node.isTextual()) {
					String value = node.asText().trim().replaceAll("[-_/]", "");
					String indexPart = expression.substring(expression.indexOf("[") + 1, expression.indexOf("]"));
					StringBuilder sb = new StringBuilder();
					for (String idxStr : indexPart.split(",")) {
						try {
							int idx = Integer.parseInt(idxStr.trim());
							if (idx >= 0 && idx < value.length())
								sb.append(value.charAt(idx));
						} catch (NumberFormatException ignore) {
						}
					}
					return sb.toString();
				}
			}

			return currentNode != null && currentNode.isValueNode() ? currentNode.asText() : null;

		} catch (Exception e) {
			System.err.println("Resolver error for expression: " + expression + " → " + e.getMessage());
			return null;
		}
	}

	public byte[] createZipFromFiles(List<String> filePaths) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try (ZipOutputStream zos = new ZipOutputStream(baos)) {
			for (String filePath : filePaths) {
				File file = new File(filePath);
				if (!file.exists())
					continue;

				try (FileInputStream fis = new FileInputStream(file)) {
					ZipEntry zipEntry = new ZipEntry(file.getName());
					zos.putNextEntry(zipEntry);

					byte[] buffer = new byte[1024];
					int length;
					while ((length = fis.read(buffer)) >= 0) {
						zos.write(buffer, 0, length);
					}
					zos.closeEntry();
				}
			}
		}
		return baos.toByteArray();
	}

	@Data
	@AllArgsConstructor
	private static class GeneratedPdf {
		private String fileName;
		private byte[] bytes;
	}

	public List<String> processAndGenerateHtml(String payloadJson, MultipartFile[] files, MultipartFile htmlFile)
			throws Exception {
		Date startTime = new Date();
		ObjectMapper mapper = new ObjectMapper();
		JsonNode payloadNode;
		try {
			payloadNode = mapper.readTree(payloadJson);
		} catch (Exception e) {
			logToDatabase(null, "FAILURE", "JSON parsing error: " + e.getMessage(), startTime);
			throw e;
		}

		Map<String, JsonNode> htmlIdToJsonField = new LinkedHashMap<>();
		for (JsonNode obj : payloadNode) {
			obj.fields().forEachRemaining(entry -> htmlIdToJsonField.put(entry.getKey(), entry.getValue()));
		}

		List<String> fileNameFields = new ArrayList<>();
		JsonNode fileNameNode = htmlIdToJsonField.get("file_name");
		if (fileNameNode != null) {
			if (fileNameNode.isTextual())
				fileNameFields.addAll(Arrays.asList(fileNameNode.asText().split(",")));
			else if (fileNameNode.isArray())
				fileNameNode.forEach(n -> fileNameFields.add(n.asText()));
		}

		List<String> passwordFields = new ArrayList<>();
		JsonNode passwordNode = htmlIdToJsonField.get("password");
		if (passwordNode != null) {
			if (passwordNode.isTextual())
				passwordFields.addAll(Arrays.asList(passwordNode.asText().split(",")));
			else if (passwordNode.isArray())
				passwordNode.forEach(n -> passwordFields.add(n.asText()));
		}

		String htmlTemplate = new String(htmlFile.getBytes(), StandardCharsets.UTF_8).replaceFirst("^\uFEFF", "");

		String outputDir = "DownloadHTMLANDPDF" + File.separator;
		Files.createDirectories(Path.of(outputDir));
		List<String> htmlPaths = new ArrayList<>();
		for (MultipartFile file : files) {
			JsonNode dataJson = mapper.readTree(file.getInputStream());
			boolean anyMatchFound = false;

			for (Iterator<Map.Entry<String, JsonNode>> users = dataJson.fields(); users.hasNext();) {
				Map.Entry<String, JsonNode> entry = users.next();
				JsonNode userNode = entry.getValue();

				for (JsonNode nodeRef : htmlIdToJsonField.values()) {
					if (nodeRef.isTextual()) {
						String refField = nodeRef.asText();
						String cleanField = refField.contains(".") ? refField.split("\\.")[1] : refField;
						if (userNode.has(cleanField)) {
							anyMatchFound = true;
							break;
						}
					}
				}
				if (anyMatchFound)
					break;
			}

//			if (!anyMatchFound) {
//				System.out.println(
//						"⚠️ Skipping JSON file '" + file.getOriginalFilename() + "' — no matching data found.");
//				logService.logActivity("SKIPPED",
//						"Skipped JSON file '" + file.getOriginalFilename() + "' — no matching data found.", startTime);
//				continue;
//			}

			for (Iterator<Map.Entry<String, JsonNode>> users = dataJson.fields(); users.hasNext();) {
				Map.Entry<String, JsonNode> entry = users.next();
				String userKey = entry.getKey();
				JsonNode userNode = entry.getValue();

				Map<String, JsonNode> normalizedFieldMap = new HashMap<>();
				normalizedFieldMap.put(userKey.toLowerCase(), userNode);
				userNode.fieldNames()
						.forEachRemaining(field -> normalizedFieldMap.put(field.toLowerCase(), userNode.get(field)));

				Document doc = Jsoup.parse(htmlTemplate);
				AtomicBoolean hasValidData = new AtomicBoolean(false);   // ✅ ADD THIS
				doc.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
				
				

				htmlIdToJsonField.forEach((id, nodeRef) -> {
					String fieldRef = nodeRef.isTextual() ? nodeRef.asText() : null;
					if (fieldRef == null)
						return;
					String fullPath = fieldRef;
					if (!fieldRef.startsWith(userKey + ".")) {
						fullPath = userKey + "." + fieldRef;
					}
					String value = resolveFieldValueWithIndexes(normalizedFieldMap, fullPath.trim());
					Element elem = doc.getElementById(id);
//					if (elem != null && value != null && !value.isEmpty()) {
//						elem.text(value);
//					}
					
					if (elem != null) {
					    if (value != null && !value.isEmpty()) {
					        elem.text(value);
					        hasValidData.set(true);   // ✅ mark valid data
					    }
					}
				});

				if (!hasValidData.get()) {
				    System.out.println("⚠️ Skipping user " + userKey + " — no valid mapped data found");
//				    continue;
				}
				
				String fileType;
				if (!fileNameFields.isEmpty()) {
					StringBuilder fnBuilder = new StringBuilder();
					for (String fnExpr : fileNameFields) {
						String fnValue = resolveFieldValueWithIndexes(normalizedFieldMap,
								userKey + "." + fnExpr.trim());
						if (fnValue != null && !fnValue.isEmpty())
							fnBuilder.append(fnValue);
						else
							fnBuilder.append("file_").append(UUID.randomUUID()).append("_");
					}
					fileType = fnBuilder.toString().replaceAll("_$", "");
				} else {
					fileType = "file_" + userKey + "_" + UUID.randomUUID();
				}

				// 3. ✅ NOW inject JSON into <head> using fileType as the key
				String userJsonStr = mapper.writeValueAsString(dataJson);
				String injectionScript = String.format(
				    "<script id='__injected_json__'>" +
				    "(function(){try{" +
				    "var d=%s;" +
				    "var n='%s';" +
				    "localStorage.setItem('common_json',JSON.stringify(d));" +
				    "localStorage.setItem('common_json_'+n,JSON.stringify(d));" +
				    "localStorage.setItem('common_json_files',n);" +
				    "}catch(e){}})();" +
				    "</script>",
				    userJsonStr, fileType
				);
				doc.head().prepend(injectionScript);
				
				String htmlFileName = outputDir + fileType + ".html";

				String userPassword = null;
				if (!passwordFields.isEmpty()) {
					StringBuilder pwBuilder = new StringBuilder();
					for (String pwExpr : passwordFields) {
						String pwValue = resolveFieldValueWithIndexes(normalizedFieldMap,
								userKey + "." + pwExpr.trim());
						pwBuilder.append(pwValue != null ? pwValue : pwExpr.trim());
					}
					userPassword = pwBuilder.toString();
				}

				String finalHtml = doc.outerHtml();
				String encryptionKey = (userPassword != null && !userPassword.isEmpty()) ? userPassword
						: "AutoEncryptHTMLFixedKey";

				String encryptedFullHtml = encryptAES(finalHtml, encryptionKey);

				StringBuilder decryptWrapper = new StringBuilder();
				decryptWrapper.append(
						"<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Encrypted Page</title></head><body>")
						.append("<div id='encrypted-content' style='display:none;'>").append(encryptedFullHtml)
						.append("</div>").append("<script>\n")
						.append("async function decryptAES(encryptedBase64, keyString) {\n")
						.append("  function base64ToArrayBuffer(base64) {\n")
						.append("    var binary_string = atob(base64);\n")
						.append("    var len = binary_string.length;\n")
						.append("    var bytes = new Uint8Array(len);\n")
						.append("    for (var i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);\n")
						.append("    return bytes;\n").append("  }\n")
						.append("  const encryptedBytes = base64ToArrayBuffer(encryptedBase64);\n")
						.append("  const iv = encryptedBytes.slice(0, 12);\n")
						.append("  const data = encryptedBytes.slice(12);\n")
						.append("  const keyBytes = new Uint8Array(32);\n")
						.append("  const passwordBytes = new TextEncoder().encode(keyString);\n")
						.append("  keyBytes.set(passwordBytes.slice(0, Math.min(32, passwordBytes.length)));\n")
						.append("  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, {name:'AES-GCM'}, false, ['decrypt']);\n")
						.append("  const decrypted = await crypto.subtle.decrypt({name:'AES-GCM', iv: iv}, cryptoKey, data);\n")
						.append("  return new TextDecoder().decode(decrypted);\n").append("}\n")
						.append("(async()=>{\n");

				if (userPassword != null && !userPassword.isEmpty()) {
					decryptWrapper.append("  try {\n")
							.append("    var pass = prompt('Enter password to view content:');\n")
							.append("    var decrypted = await decryptAES(document.getElementById('encrypted-content').textContent, pass);\n")
							.append("    document.open(); document.write(decrypted); document.close();\n")
							.append("  } catch(e){ document.body.innerHTML='<h2>Access Denied</h2>'; console.error(e); }\n");
				} else {
					decryptWrapper.append("  try {\n").append(
							"    var decrypted = await decryptAES(document.getElementById('encrypted-content').textContent, 'AutoEncryptHTMLFixedKey');\n")
							.append("    document.open(); document.write(decrypted); document.close();\n")
							.append("  } catch(e){ document.body.innerHTML='<h2>Decryption Error</h2>'; console.error(e); }\n");
				}

				decryptWrapper.append("})();\n</script></body></html>");

				Files.write(Path.of(htmlFileName), decryptWrapper.toString().getBytes(StandardCharsets.UTF_8));
				htmlPaths.add(htmlFileName);
			}
		}

		return htmlPaths;
	}

	
	private String encryptAES(String plaintext, String password) throws Exception {
		byte[] keyBytes = Arrays.copyOf(password.getBytes(StandardCharsets.UTF_8), 32); // 256-bit key
		SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

		byte[] iv = new byte[12];
		new SecureRandom().nextBytes(iv);
		GCMParameterSpec spec = new GCMParameterSpec(128, iv);

		Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
		cipher.init(Cipher.ENCRYPT_MODE, keySpec, spec);
		byte[] encrypted = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

		byte[] encryptedWithIv = new byte[iv.length + encrypted.length];
		System.arraycopy(iv, 0, encryptedWithIv, 0, iv.length);
		System.arraycopy(encrypted, 0, encryptedWithIv, iv.length, encrypted.length);

		return Base64.getEncoder().encodeToString(encryptedWithIv);
	}

	private String extractBodyContent(String html) {
		int start = html.indexOf("<body");
		start = html.indexOf(">", start) + 1;
		int end = html.indexOf("</body>", start);
		return html.substring(start, end);
	}

	
	
	public void logToDatabase(RequestDTO request, String result, String errorMessage, Date startTime)
			throws SQLException {

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date endTime = new Date();

		LogData info = new LogData();
		info.setMessage(errorMessage);
		info.setResult(result);
		info.setSendRequestTime(startTime);
		info.setOutputResponseTime(endTime);
		logRepository.save(info);
	}

}

//body.add("chartData", userNode.toString());
//body.add("chartData", dataJson.toString());  // FULL JSON

//sdds
//public List<String> processAndGeneratePdf(MultipartFile htmlFile) throws IOException {
//	String outputDir = "output/";
//	Files.createDirectories(Path.of(outputDir));
//
//	List<String> pdfPaths = new ArrayList<>();
//	RestTemplate restTemplate = new RestTemplate();
//
//	String pdfFileName = outputDir + UUID.randomUUID() + ".pdf";
//
//	HttpHeaders headers = new HttpHeaders();
//	headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//	MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//	body.add("file", new ByteArrayResource(htmlFile.getBytes()) {
//		@Override
//		public String getFilename() {
//			return htmlFile.getOriginalFilename();
//		}
//	});
//
//	HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
//
//	String apiUrl = "http://192.168.0.188:3010/api/v1/s3Upload/uploadHtml5";
////	String apiUrl = "http://api.ariantechsolutions.in/interactive-server/api/v1/s3Upload/uploadHtml5";
//
//	try {
//		
//		ResponseEntity<byte[]> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, byte[].class);
//
//		// Validate body
//		if (response.getBody() == null || response.getBody().length == 0) {
//
//		    logService.logActivity(
//		            "FAILURE",
//		            "Error while calling remote API",
//		            new Date()
//		    );
//
//		    throw new IOException("Error API returned empty response");
//		}
//
//		// Save on success
//		Files.write(Path.of(pdfFileName), response.getBody());
//		pdfPaths.add(pdfFileName);
//
//		
//	}catch(Exception ex) {
//		
//		  logService.logActivity(
//	                "ERROR",
//	                "Error while calling remote API: " + ex.getMessage(),
//	                new Date()
//	        );
//
//	        throw new IOException("Error API call failed");
//		
//	}
//
//
//	return pdfPaths;
//}
