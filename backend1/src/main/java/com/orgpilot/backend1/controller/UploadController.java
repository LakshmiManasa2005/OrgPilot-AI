package com.orgpilot.backend1.controller;
import com.orgpilot.backend1.service.DocumentService;
import com.orgpilot.backend1.entity.Document;
import com.orgpilot.backend1.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5180",
        "http://127.0.0.1:5180",
        "http://localhost:5173",
        "http://localhost:5174"
})
public class UploadController {
    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentRepository documentRepository;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {

        try {

            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

            File directory = new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            File destination = new File(directory, file.getOriginalFilename());

            file.transferTo(destination);

            // Save document details in MySQL
            Document document = new Document();

            document.setFileName(file.getOriginalFilename());
            document.setFilePath(destination.getAbsolutePath());

            documentRepository.save(document);

            return "File uploaded successfully!";

        } catch (IOException e) {

            e.printStackTrace();

            return "Upload failed!";

        }

    }

    @GetMapping("/files")
    public List<String> getFiles() {
        return documentRepository.findAll()
                .stream()
                .map(Document::getFileName)
                .toList();
    }

    @GetMapping("/documents")
    public List<Document> getDocuments() {
        return documentRepository.findAll();
    }
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {

        try {

            Path path = Paths.get("uploads").resolve(fileName);

            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity.badRequest().build();

        }

    }

    @GetMapping("/preview/{fileName}")
    public ResponseEntity<Resource> previewFile(@PathVariable String fileName) {
        try {
            String uploadDir = System.getProperty("user.dir")
                    + File.separator + "uploads";

            Path path = Paths.get(uploadDir).resolve(fileName)
                    .normalize();

            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = java.nio.file.Files.probeContentType(path);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE,
                            contentType != null ? contentType : "application/octet-stream")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    @DeleteMapping("/documents/{id}")
    public String deleteDocument(@PathVariable Long id) {

        documentService.deleteDocument(id);

        return "Document Deleted";
    }

}