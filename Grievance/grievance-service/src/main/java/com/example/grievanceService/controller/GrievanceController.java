package com.example.grievanceService.controller;

import com.example.grievanceService.service.GrievanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/grievance")
public class GrievanceController {

    private final GrievanceService service;

    public GrievanceController(GrievanceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        try {
            return ResponseEntity.ok(service.getAllGrievances());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Map<String, Object>>> filter(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String product,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String propertyName,
            @RequestParam(required = false) String value) {
        try {
            List<Map<String, Object>> result;
            
            // Support multiple filter options
            if (propertyName != null && value != null) {
                // Generic filter using property name
                result = service.filterGrievances(propertyName, value);
            } else if (company != null) {
                result = service.filterGrievances("company", company);
            } else if (product != null) {
                result = service.filterGrievances("product", product);
            } else if (state != null) {
                result = service.filterGrievances("state", state);
            } else {
                result = service.getAllGrievances();
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> grievanceData) {
        try {
            Map<String, Object> created = service.createGrievance(grievanceData);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        try {
            return ResponseEntity.ok(service.getGrievanceStatistics());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/timely-response-count")
    public ResponseEntity<Map<String, Long>> getTimelyResponseCount() {
        try {
            long count = service.getTimelyRespondedCount();
            return ResponseEntity.ok(Map.of("timelyRespondedCount", count));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
