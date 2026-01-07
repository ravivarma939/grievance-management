package com.example.grievanceService.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GrievanceService {

    private static final String GRIEVANCE_API_BASE = "http://localhost:3232/grievance";
    
    private final RestTemplate restTemplate;

    public GrievanceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> getAllGrievances() {
        try {
            List<Map<String, Object>> result = restTemplate.getForObject(GRIEVANCE_API_BASE, List.class);
            return result != null ? result : new ArrayList<>();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch grievances from external API: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> filterGrievances(String propertyName, String value) {
        try {
            // Use query parameter for filtering as per API documentation
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(GRIEVANCE_API_BASE)
                    .queryParam(propertyName, value);
            
            List<Map<String, Object>> result = restTemplate.getForObject(builder.toUriString(), List.class);
            return result != null ? result : new ArrayList<>();
        } catch (Exception e) {
            throw new RuntimeException("Failed to filter grievances: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> createGrievance(Map<String, Object> grievanceData) {
        try {
            return restTemplate.postForObject(GRIEVANCE_API_BASE, grievanceData, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create grievance: " + e.getMessage(), e);
        }
    }

    public long getTimelyRespondedCount() {
        try {
            List<Map<String, Object>> allGrievances = getAllGrievances();
            return allGrievances.stream()
                    .filter(g -> {
                        Object timelyResponse = g.get("timely_response");
                        return timelyResponse != null && 
                               "Yes".equalsIgnoreCase(String.valueOf(timelyResponse));
                    })
                    .count();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate timely responded count: " + e.getMessage(), e);
        }
    }

    public Map<String, Long> getGrievanceStatistics() {
        try {
            List<Map<String, Object>> allGrievances = getAllGrievances();
            Map<String, Long> stats = new HashMap<>();
            
            stats.put("totalGrievances", (long) allGrievances.size());
            stats.put("timelyResponded", getTimelyRespondedCount());
            stats.put("notTimelyResponded", stats.get("totalGrievances") - stats.get("timelyResponded"));
            
            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate statistics: " + e.getMessage(), e);
        }
    }
}
