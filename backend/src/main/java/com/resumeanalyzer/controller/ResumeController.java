package com.resumeanalyzer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Stub controller for resume analysis.
 * Full implementation added in Task 2 (PDF extraction) and Task 4 (AI match scoring).
 */
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @PostMapping("/analyze")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> analyze(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescription) {

        // TODO Task 2: Extract text from PDF using PDFBox
        // TODO Task 3: Call Gemini API with resume text + job description
        // TODO Task 4: Parse response into AnalysisResponse DTO

        return ResponseEntity.ok(Map.of(
            "message", "Analysis endpoint ready — implementation coming in Task 2-4",
            "fileName", resumeFile.getOriginalFilename(),
            "jobDescriptionLength", jobDescription.length()
        ));
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> history() {
        // TODO Task 6: Return user's analysis history from DB
        return ResponseEntity.ok(Map.of("message", "History endpoint ready — implementation in Task 6"));
    }
}
