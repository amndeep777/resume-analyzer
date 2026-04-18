package com.resumeanalyzer.repository;

import com.resumeanalyzer.entity.AnalysisHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisHistoryRepository extends JpaRepository<AnalysisHistory, Long> {
    List<AnalysisHistory> findByUserIdOrderByAnalyzedAtDesc(Long userId);
    long countByUserId(Long userId);
}
