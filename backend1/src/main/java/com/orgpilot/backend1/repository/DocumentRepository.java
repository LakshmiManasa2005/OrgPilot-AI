package com.orgpilot.backend1.repository;

import com.orgpilot.backend1.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByFileNameContainingIgnoreCase(String fileName);

}