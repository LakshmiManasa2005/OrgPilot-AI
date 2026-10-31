package com.orgpilot.backend1.service;

import com.orgpilot.backend1.entity.Document;
import com.orgpilot.backend1.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Document> searchDocuments(String keyword) {
        return documentRepository.findByFileNameContainingIgnoreCase(keyword);
    }

    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            throw new RuntimeException("Unable to delete physical file", e);
        }

        documentRepository.delete(document);
    }
}