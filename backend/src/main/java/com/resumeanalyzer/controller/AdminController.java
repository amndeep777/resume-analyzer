package com.resumeanalyzer.controller;

import com.resumeanalyzer.repository.AnalysisHistoryRepository;
import com.resumeanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Admin-only endpoints.
 * Full dashboard stats implemented in Task 7.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnalysisHistoryRepository analysisHistoryRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        return ResponseEntity.ok(Map.of(
            "totalUsers", userRepository.count(),
            "totalAnalyses", analysisHistoryRepository.count()
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<?> users() {
        // TODO Task 7: Return paginated user list with analysis counts
        return ResponseEntity.ok(userRepository.findAll().stream().map(u -> Map.of(
            "id", u.getId(),
            "username", u.getUsername(),
            "email", u.getEmail(),
            "role", u.getRole(),
            "createdAt", u.getCreatedAt()
        )).toList());
    }
}
