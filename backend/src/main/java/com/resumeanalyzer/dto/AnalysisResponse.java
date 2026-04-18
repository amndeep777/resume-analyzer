package com.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private Long id;
    private String resumeFileName;
    private String jobDescription;
    private Integer matchScore;
    private List<String> missingSkills;
    private List<String> matchedKeywords;
    private List<String> suggestions;
    private LocalDateTime analyzedAt;
}
