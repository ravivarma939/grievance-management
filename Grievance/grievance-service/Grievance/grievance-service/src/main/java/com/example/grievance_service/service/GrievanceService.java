package com.example.grievanceService.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GrievanceService {

    private static final String GRIEVANCE_API =
            "http://localhost:3232/grievance";

    private final RestTemplate restTemplate;

    public GrievanceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> getAllGrievances() {
        return restTemplate.getForObject(GRIEVANCE_API, List.class);
    }

    public List<Map<String, Object>> filterGrievances(String key, String value) {
        return getAllGrievances().stream()
                .filter(g -> value.equalsIgnoreCase(
                        String.valueOf(g.get(key))
                ))
                .collect(Collectors.toList());
    }

    public long getTimelyRespondedCount() {
        return getAllGrievances().stream()
                .filter(g ->
                        "Yes".equalsIgnoreCase(
                                String.valueOf(g.get("timely_response"))
                        )
                )
                .count();
    }
}
