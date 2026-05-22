package com.example.InteractiveDesignBackend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.InteractiveDesignBackend.Dto.RequestDTO;
import com.example.InteractiveDesignBackend.Entity.RecordEntity;
import com.example.InteractiveDesignBackend.Services.LogService;
import com.example.InteractiveDesignBackend.Services.RecordService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RecordController {

	@Autowired
	private RecordService service;

	@Autowired
	private LogService logService;

	// ---------------------- UPLOAD PDF ----------------------
	@PostMapping("/uploadPdf")
	public ResponseEntity<byte[]> uploadPdf(@RequestPart(value = "payload", required = false) String payload,
			@RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {

		Date startTime = new Date();

		try {
			
//			if (payload == null || payload.isEmpty()) {
//				String msg = "Payload is missing or empty";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
			
			if (payload == null || payload.isEmpty()) {
			    payload = "[]";   // default empty mapping
			}

			if (files == null || files.length == 0 || Arrays.stream(files).allMatch(f -> f == null || f.isEmpty())) {
				String msg = "JSON file not selected";
				logService.logActivity("FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			if (htmlFile == null || htmlFile.isEmpty()) {
				String msg = "HTML file not selected";
				logService.logActivity("FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			List<String> generatedPdfPaths = service.processAndGeneratePdf(payload, files, htmlFile);

			if (generatedPdfPaths.isEmpty()) {
				String msg = "No PDF files generated from the given input";
				logService.logActivity("FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			byte[] zipBytes = service.createZipFromFiles(generatedPdfPaths);
			String randomFileName = UUID.randomUUID().toString() + ".zip";

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);

			int pdfCount = generatedPdfPaths.size();
			String successMsg = pdfCount + (pdfCount == 1 ? " PDF" : " PDFs") + " generated and zipped successfully";
			logService.logActivity( "SUCCESS", successMsg, startTime);

			return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);

		} catch (Exception e) {
			String msg = "Exception occurred while uploading PDF: " + e.getMessage();
			logService.logActivity("FAILURE", msg, startTime);
			return ResponseEntity.internalServerError().body(msg.getBytes());
		}
	}

	// ---------------------- UPLOAD HTML ----------------------
	@PostMapping("/uploadHtml")
	public ResponseEntity<byte[]> uploadHtml(@RequestPart(value = "payload", required = false) String payload,
			@RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {

		Date startTime = new Date();

		try {
			if (payload == null || payload.isEmpty()) {
				String msg = "Payload is missing or empty";
				logService.logActivity( "FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			if (files == null || files.length == 0 || Arrays.stream(files).allMatch(f -> f == null || f.isEmpty())) {
				String msg = "JSON file not selected";
				logService.logActivity( "FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			if (htmlFile == null || htmlFile.isEmpty()) {
				String msg = "HTML file not selected";
				logService.logActivity( "FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			List<String> generatedHtmlPaths = service.processAndGenerateHtml(payload, files, htmlFile);
			if (generatedHtmlPaths.isEmpty()) {
				String msg = "No HTML files generated from the given input";
				logService.logActivity( "FAILURE", msg, startTime);
				return ResponseEntity.badRequest().body(msg.getBytes());
			}

			byte[] zipBytes = service.createZipFromFiles(generatedHtmlPaths);
			String randomFileName = UUID.randomUUID().toString() + ".zip";

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);

			int count = generatedHtmlPaths.size();
			String successMsg = count + (count == 1 ? " HTML" : " HTMLs") + " generated and zipped successfully";
			logService.logActivity( "SUCCESS", successMsg, startTime);

			return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);

		} catch (Exception e) {
			String msg = "Exception occurred while uploading HTML: " + e.getMessage();
			logService.logActivity( "FAILURE", msg, startTime);
			return ResponseEntity.internalServerError().body(msg.getBytes());
		}
	}

	@PostMapping("/uploadSinglePagePdf")
	public ResponseEntity<byte[]> SingleHtmlToPdf(
			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {

		Date startTime = new Date();
		RequestDTO requestDTO = new RequestDTO();

		try {
			if (htmlFile == null || htmlFile.isEmpty()) {
				String errorMsg = "HTML file not selected";
				logService.logActivity( "FAILURE", errorMsg, startTime);
				return ResponseEntity.badRequest().body(errorMsg.getBytes());
			}

			List<String> generatedPdfPaths = service.SingleHtmlToPdf(htmlFile);

			if (generatedPdfPaths.isEmpty()) {
				String errorMsg = "No PDF files generated from the given input";
				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
				return ResponseEntity.badRequest().body(errorMsg.getBytes());
			}

			String pdfPath = generatedPdfPaths.get(0);
			File pdfFile = new File(pdfPath);
			byte[] pdfBytes = java.nio.file.Files.readAllBytes(pdfFile.toPath());

			String randomFileName = UUID.randomUUID().toString() + ".pdf";

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);

			String filename = new RecordEntity().getFileName();

			StringBuilder pdfFileNamesBuilder = new StringBuilder();
			for (String path : generatedPdfPaths) {
				if (pdfFileNamesBuilder.length() > 0)
					pdfFileNamesBuilder.append(", ");
				pdfFileNamesBuilder.append(Paths.get(path).getFileName().toString());
			}
			String pdfFileNames = pdfFileNamesBuilder.toString();

			logService.logActivity("SUCCESS", "Single page PDF generated successfully",
					startTime);

			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

		} catch (Exception e) {
			String errorMsg = "Exception occurred: " + e.getMessage();
			return ResponseEntity.internalServerError().body(errorMsg.getBytes());
		}
	}
	
	
	@PostMapping("/uploadHtmlToPdf")
	public ResponseEntity<byte[]> uploadHtmlToPdf(
	        @RequestPart(value = "file", required = false) MultipartFile htmlFile,
	        @RequestPart(value = "payload", required = false) String payload) {

	    Date startTime = new Date();

	    try {

	        if (htmlFile == null || htmlFile.isEmpty()) {
	            String msg = "HTML file not selected";
	            logService.logActivity("FAILURE", msg, startTime);
	            return ResponseEntity.badRequest().body(msg.getBytes());
	        }

	        if (payload == null || payload.isBlank()) {
	            String msg = "Payload missing";
	            logService.logActivity("FAILURE", msg, startTime);
	            return ResponseEntity.badRequest().body(msg.getBytes());
	        }

	        List<String> generatedPdfPaths =
	                service.processAndGeneratePdf(htmlFile, payload);

	        if (generatedPdfPaths.isEmpty()) {
	            String msg = "No PDF generated";
	            logService.logActivity("FAILURE", msg, startTime);
	            return ResponseEntity.badRequest().body(msg.getBytes());
	        }

	        File pdfFile = new File(generatedPdfPaths.get(0));
	        byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());

	        String randomFileName = UUID.randomUUID() + ".pdf";

	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_PDF);
	        headers.set(HttpHeaders.CONTENT_DISPOSITION,
	                "attachment; filename=" + randomFileName);

	        logService.logActivity("SUCCESS", "PDF generated", startTime);

	        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

	    } catch (Exception e) {

	        logService.logActivity("FAILURE", e.getMessage(), startTime);
	        return ResponseEntity.internalServerError()
	                .body(e.getMessage().getBytes());
	    }
	}

}
	// ---------------------- DIRECT HTML TO PDF ----------------------
//	@PostMapping("/uploadHtmlToPdf")
//	public ResponseEntity<byte[]> uploadHtmlToPdf(
//			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//		Date startTime = new Date();
//
//		try {
//			if (htmlFile == null || htmlFile.isEmpty()) {
//				String msg = "HTML file not selected";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
//
//			List<String> generatedPdfPaths = service.processAndGeneratePdf(htmlFile);
//			if (generatedPdfPaths.isEmpty()) {
//				String msg = "No PDF files generated from the given input";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
//
//			File pdfFile = new File(generatedPdfPaths.get(0));
//			byte[] pdfBytes = java.nio.file.Files.readAllBytes(pdfFile.toPath());
//			String randomFileName = UUID.randomUUID().toString() + ".pdf";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_PDF);
//			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
////              String dataJpa=headers.getAccessControlAllowOrigin();
//
//			logService.logActivity("SUCCESS", "PDF generated successfully", startTime);
//			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
//		} catch (Exception e) {
//			String msg = "Exception occurred while converting HTML to PDF: " + e.getMessage();
//			logService.logActivity("FAILURE", msg, startTime);
//			return ResponseEntity.internalServerError().body(msg.getBytes());
//		}
//	}
	


	// ---------------------- SINGLE HTML TO PDF ----------------------
//    @PostMapping("/uploadSinglePagePdf")
//    public ResponseEntity<byte[]> uploadSinglePagePdf(@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//        Date startTime = new Date();
//
//        try {
//            if (htmlFile == null || htmlFile.isEmpty()) {
//                String msg = "HTML file not selected";
//                logService.logActivity(null, "SINGLE_HTML_TO_PDF", "FAILURE", msg, startTime);
//                return ResponseEntity.badRequest().body(msg.getBytes());
//            }
//
//            List<String> generatedPdfPaths = service.SingleHtmlToPdf(htmlFile);
//            if (generatedPdfPaths.isEmpty()) {
//                String msg = "No PDF files generated from the given input";
//                logService.logActivity(null, "SINGLE_HTML_TO_PDF", "FAILURE", msg, startTime);
//                return ResponseEntity.badRequest().body(msg.getBytes());
//            }
//
//            File pdfFile = new File(generatedPdfPaths.get(0));
//            byte[] pdfBytes = java.nio.file.Files.readAllBytes(pdfFile.toPath());
//            String randomFileName = UUID.randomUUID().toString() + ".pdf";
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//
//            logService.logActivity(null, "SINGLE_HTML_TO_PDF", "SUCCESS", "PDF generated successfully", startTime);
//            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
//
//        } catch (Exception e) {
//            String msg = "Exception occurred while converting single HTML to PDF: " + e.getMessage();
//            logService.logActivity(null, "SINGLE_HTML_TO_PDF", "FAILURE", msg, startTime);
//            return ResponseEntity.internalServerError().body(msg.getBytes());
//        }
//    }

//	// ---------------------- UPLOAD PDF ----------------------
//  @PostMapping("/uploadPdf")
//  public ResponseEntity<byte[]> uploadPdf(
//          @RequestPart(value = "payload", required = false) String payload,
//          @RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
//          @RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//      Date startTime = new Date();
//
//      try {
//          if (payload == null || payload.isEmpty()) {
//              String msg = "Payload is missing or empty";
//              logService.logActivity(null, "HTML_TO_PDF", "FAILURE", msg, startTime);
//              return ResponseEntity.badRequest().body(msg.getBytes());
//          }
//
//          if (files == null || files.length == 0 || Arrays.stream(files).allMatch(f -> f == null || f.isEmpty())) {
//              String msg = "JSON file not selected";
//              logService.logActivity(null, "HTML_TO_PDF", "FAILURE", msg, startTime);
//              return ResponseEntity.badRequest().body(msg.getBytes());
//          }
//
//          if (htmlFile == null || htmlFile.isEmpty()) {
//              String msg = "HTML file not selected";
//              logService.logActivity(null, "HTML_TO_PDF", "FAILURE", msg, startTime);
//              return ResponseEntity.badRequest().body(msg.getBytes());
//          }
//
//          List<String> generatedPdfPaths = service.processAndGeneratePdf(payload, files, htmlFile);
//          if (generatedPdfPaths.isEmpty()) {
//              String msg = "No PDF files generated from the given input";
//              logService.logActivity(null, "HTML_TO_PDF", "FAILURE", msg, startTime);
//              return ResponseEntity.badRequest().body(msg.getBytes());
//          }
//
//          // ✅ Create ZIP
//          byte[] zipBytes = service.createZipFromFiles(generatedPdfPaths);
//          String randomFileName = UUID.randomUUID().toString() + ".zip";
//
//          HttpHeaders headers = new HttpHeaders();
//          headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//          headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//
//          int pdfCount = generatedPdfPaths.size();
//          String successMsg = pdfCount + (pdfCount == 1 ? " PDF" : " PDFs") + " generated and zipped successfully";
//          logService.logActivity(null, "HTML_TO_PDF", "SUCCESS", successMsg, startTime);
//
//          return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
//
//      } catch (Exception e) {
//          String msg = "Exception occurred while uploading PDF: " + e.getMessage();
//          logService.logActivity(null, "HTML_TO_PDF", "FAILURE", msg, startTime);
//          return ResponseEntity.internalServerError().body(msg.getBytes());
//      }
//  }

//	@PostMapping("/uploadPdf")
//	public ResponseEntity<byte[]> upload(@RequestPart(value = "payload", required = false) String payload,
//			@RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
//			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//		Date startTime = new Date();
//		RequestDTO requestDTO = new RequestDTO();
//		try {
//			if (payload == null || payload.isEmpty()) {
//				String errorMsg = "Payload is missing or empty";
////				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				logService.logActivity(null, "HTML_TO_PDF","FAILURE", errorMsg, startTime);	
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			if (files == null || files.length == 0 || Arrays.stream(files).allMatch(f -> f == null || f.isEmpty())) {
//				String errorMsg = "JSON file not selected";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			if (htmlFile == null || htmlFile.isEmpty()) {
//				String errorMsg = "HTML file not selected";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			List<String> generatedPdfPaths = service.processAndGeneratePdf(payload, files, htmlFile);
//
//			if (generatedPdfPaths.isEmpty()) {
//				String errorMsg = "No PDF files generated from the given input";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			byte[] zipBytes = service.createZipFromFiles(generatedPdfPaths);
//			String randomFileName = UUID.randomUUID().toString() + ".zip";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//			headers.setContentLength(zipBytes.length);
//			
//			StringBuilder pdfFileNamesBuilder = new StringBuilder();
//			for (String path : generatedPdfPaths) {
//			    if (pdfFileNamesBuilder.length() > 0) pdfFileNamesBuilder.append(", ");
//			    pdfFileNamesBuilder.append(Paths.get(path).getFileName().toString());
//			}
////			String pdfFileNames = pdfFileNamesBuilder.toString();
////
////			service.logToDatabase(requestDTO, "SUCCESS","PDF generated and zipped successfully", startTime);
//			
//			int pdfCount = generatedPdfPaths.size();
//
////			String pdfFileNames = pdfFileNamesBuilder.toString();
//			String pdfWord = (pdfCount == 1) ? "PDF" : "PDFs";
//
//			String successMsg = pdfCount + " " + pdfWord + " generated and zipped successfully";
//
//
//			service.logToDatabase(requestDTO, "SUCCESS",successMsg, startTime);
//			return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
//    
//		} catch (Exception e) {
//			String errorMsg = "Exception occurred: " + e.getMessage();
//			return ResponseEntity.internalServerError().body(errorMsg.getBytes());
//		}
//	}
//    
//	@PostMapping("/uploadHtml")
//	public ResponseEntity<byte[]> uploadHtml(@RequestPart(value = "payload", required = false) String payload,
//			@RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
//			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//    
//		Date startTime = new Date();
//		RequestDTO requestDTO = new RequestDTO();
//
//		try {
//			if (payload == null || payload.isEmpty()) {
//				String errorMsg = "Payload is missing or empty";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			if (files == null || files.length == 0 || Arrays.stream(files).allMatch(f -> f == null || f.isEmpty())) {
//				String errorMsg = "JSON file not selected";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			if (htmlFile == null || htmlFile.isEmpty()) {
//				String errorMsg = "HTML file not selected";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			List<String> generatedHtmlPaths = service.processAndGenerateHtml(payload, files, htmlFile);
//
//			if (generatedHtmlPaths.isEmpty()) {
//				String errorMsg = "No HTML files generated from the given input";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			byte[] zipBytes = service.createZipFromFiles(generatedHtmlPaths);
//			String randomFileName = UUID.randomUUID().toString() + ".zip";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//			headers.setContentLength(zipBytes.length);
//			
//			
//			StringBuilder pdfFileNamesBuilder = new StringBuilder();
//			for (String path : generatedHtmlPaths) {
//			    if (pdfFileNamesBuilder.length() > 0) pdfFileNamesBuilder.append(", ");
//			    pdfFileNamesBuilder.append(Paths.get(path).getFileName().toString());
//			}
//			String pdfFileNames = pdfFileNamesBuilder.toString();
//			
//			int pdfCount = generatedHtmlPaths.size();
//
////			String pdfFileNames = pdfFileNamesBuilder.toString();
//			String pdfWord = (pdfCount == 1) ? "HTML" : "HTMLs";
//
//			String successMsg = pdfCount + " " + pdfWord + " generated and zipped successfully";
//
//
//			service.logToDatabase(requestDTO, "SUCCESS",successMsg, startTime);			
//
//			return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
//
//		} catch (Exception e) {
//			String errorMsg = "Exception occurred: " + e.getMessage();
//
//			try {
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//			} catch (SQLException sqlEx) {
//				sqlEx.printStackTrace();
//			}
//			return ResponseEntity.internalServerError().body(errorMsg.getBytes());
//		}
//
//	}
//	
//	
//	
//	@PostMapping("/uploadSinglePagePdf")
//	public ResponseEntity<byte[]> SingleHtmlToPdf(
//			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//		Date startTime = new Date();
//		RequestDTO requestDTO = new RequestDTO();
//
//		try {
//			if (htmlFile == null || htmlFile.isEmpty()) {
//				String errorMsg = "HTML file not selected";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			List<String> generatedPdfPaths = service.SingleHtmlToPdf(htmlFile);
//
//			if (generatedPdfPaths.isEmpty()) {
//				String errorMsg = "No PDF files generated from the given input";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			String pdfPath = generatedPdfPaths.get(0);
//			File pdfFile = new File(pdfPath);
//			byte[] pdfBytes = java.nio.file.Files.readAllBytes(pdfFile.toPath());
//
//			String randomFileName = UUID.randomUUID().toString() + ".pdf";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_PDF);
//			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//			
//			String filename= new RecordEntity().getFileName();
//			
//			StringBuilder pdfFileNamesBuilder = new StringBuilder();
//			for (String path : generatedPdfPaths) {
//			    if (pdfFileNamesBuilder.length() > 0) pdfFileNamesBuilder.append(", ");
//			    pdfFileNamesBuilder.append(Paths.get(path).getFileName().toString());
//			}
//			String pdfFileNames = pdfFileNamesBuilder.toString();
//
//			service.logToDatabase(requestDTO, "SUCCESS", pdfFileNames + " generated and zipped successfully", startTime);
//			
//
//			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
//
//		} catch (Exception e) {
//			String errorMsg = "Exception occurred: " + e.getMessage();
//			return ResponseEntity.internalServerError().body(errorMsg.getBytes());
//		}
//	}
//	
//	
//	@PostMapping("/uploadHtmlToPdf")
//	public ResponseEntity<byte[]> uploadHtmlToPdf(
//			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//		Date startTime = new Date();
//		RequestDTO requestDTO = new RequestDTO();
//
//		try {
//			if (htmlFile == null || htmlFile.isEmpty()) {
//				String errorMsg = "HTML file not selected";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			List<String> generatedPdfPaths = service.processAndGeneratePdf(htmlFile);
//
//			if (generatedPdfPaths.isEmpty()) {
//				String errorMsg = "No PDF files generated from the given input";
//				service.logToDatabase(requestDTO, "FAILURE", errorMsg, startTime);
//				return ResponseEntity.badRequest().body(errorMsg.getBytes());
//			}
//
//			String pdfPath = generatedPdfPaths.get(0);
//			File pdfFile = new File(pdfPath);
//			byte[] pdfBytes = java.nio.file.Files.readAllBytes(pdfFile.toPath());
//
//			String randomFileName = UUID.randomUUID().toString() + ".pdf";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_PDF);
//			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//			
//			String filename= new RecordEntity().getFileName();
//			
//			StringBuilder pdfFileNamesBuilder = new StringBuilder();
//			for (String path : generatedPdfPaths) {
//			    if (pdfFileNamesBuilder.length() > 0) pdfFileNamesBuilder.append(", ");
//			    pdfFileNamesBuilder.append(Paths.get(path).getFileName().toString());
//			}
//			String pdfFileNames = pdfFileNamesBuilder.toString();
//
//			service.logToDatabase(requestDTO, "SUCCESS", pdfFileNames + " generated and zipped successfully", startTime);
//			
//
//			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
//
//		} catch (Exception e) {
//			String errorMsg = "Exception occurred: " + e.getMessage();
//			return ResponseEntity.internalServerError().body(errorMsg.getBytes());
//		}
//	}



//@GetMapping("/getErrorLogs")
//public ResponseEntity<List<LogData>> getErrorLogs(
//		@RequestParam(value = "startDate", required = false) String startDate,
//		@RequestParam(value = "endDate", required = false) String endDate) {
//
//	HttpHeaders headers = new HttpHeaders();
//	headers.add("Access-Control-Allow-Methods", "GET");
//	headers.add("Access-Control-Allow-Headers", "Content-Type");
//
//	try {
//		if (ObjectUtils.isEmpty(startDate) && ObjectUtils.isEmpty(endDate)) {
//			List<LogData> allLogs = logBookRepo.findAll();
//			return ResponseEntity.ok().headers(headers).body(allLogs);
//		}
//
//		SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
//		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//
//		Date start = null;
//		Date end = null;
//
//		if (!ObjectUtils.isEmpty(startDate)) {
//			Date parsedStart = inputFormat.parse(startDate);
//			String formattedStart = outputFormat.format(parsedStart);
//			start = outputFormat.parse(formattedStart);
//		}
//
//		if (!ObjectUtils.isEmpty(endDate)) {
//			Date parsedEnd = inputFormat.parse(endDate);
//			String formattedEnd = new SimpleDateFormat("yyyy-MM-dd").format(parsedEnd) + " 23:59:59";
//			end = outputFormat.parse(formattedEnd);
//		}
//
//		List<LogData> logs;
//
//		if (start != null && end != null) {
//			logs = logBookRepo.findBySendRequestTimeBetween(start, end);
//		} else if (start != null) {
//			logs = logBookRepo.findBySendRequestTimeAfter(start);
//		} else {
//			logs = logBookRepo.findBySendRequestTimeBefore(end);
//		}
//
//		return ResponseEntity.ok().headers(headers).body(logs);
//
//	} catch (Exception e) {
//		e.printStackTrace();
//		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).headers(headers).body(List.of());
//	}
//}











//---------------------- UPLOAD PDF ----------------------
//	@PostMapping("/uploadPdf")
//	public ResponseEntity<byte[]> uploadPdf(@RequestPart(value = "payload", required = false) String payload,
//			@RequestPart(value = "jsonFile", required = false) MultipartFile[] files,
//			@RequestPart(value = "file", required = false) MultipartFile htmlFile) {
//
//		Date startTime = new Date();
//
//		try {
//			if (payload == null || payload.isEmpty()) {
//				String msg = "Payload is missing or empty";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
//
//			if (files == null || files.length == 0 || Arrays.stream(files).allMatch(f -> f == null || f.isEmpty())) {
//				String msg = "JSON file not selected";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
//
//			if (htmlFile == null || htmlFile.isEmpty()) {
//				String msg = "HTML file not selected";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
//
//			List<String> generatedPdfPaths = service.processAndGeneratePdf(payload, files, htmlFile);
//
//			if (generatedPdfPaths.isEmpty()) {
//				String msg = "No PDF files generated from the given input";
//				logService.logActivity("FAILURE", msg, startTime);
//				return ResponseEntity.badRequest().body(msg.getBytes());
//			}
//
//			byte[] zipBytes = service.createZipFromFiles(generatedPdfPaths);
//			String randomFileName = UUID.randomUUID().toString() + ".zip";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//			headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + randomFileName);
//
//			int pdfCount = generatedPdfPaths.size();
//			String successMsg = pdfCount + (pdfCount == 1 ? " PDF" : " PDFs") + " generated and zipped successfully";
//			logService.logActivity( "SUCCESS", successMsg, startTime);
//
//			return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
//
//		} catch (Exception e) {
//			String msg = "Exception occurred while uploading PDF: " + e.getMessage();
//			logService.logActivity("FAILURE", msg, startTime);
//			return ResponseEntity.internalServerError().body(msg.getBytes());
//		}
//	}
