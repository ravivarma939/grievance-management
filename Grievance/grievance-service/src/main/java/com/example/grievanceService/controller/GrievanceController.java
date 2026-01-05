package com.example.grievanceService.controller;

import com.example.grievanceService.entity.GrievanceData;
import com.example.grievanceService.service.GrievanceService;
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

    @PostMapping
    public GrievanceData save(@RequestBody GrievanceData data) {
        return service.save(data);
    }

    @GetMapping
    public List<GrievanceData> getAll() {
        return service.getAllGrievances();
    }

    @GetMapping("/filter")
    public List<GrievanceData> filter(
            @RequestParam String issueType,
            @RequestParam String company) {
        return service.filter(issueType, company);
    }

    @PutMapping("/{grievanceId}")
    public GrievanceData update(
            @PathVariable Long grievanceId,
            @RequestBody GrievanceData data) {
        return service.update(grievanceId, data);
    }

    @DeleteMapping("/{grievanceId}")
    public String delete(@PathVariable Long grievanceId) {
        service.delete(grievanceId);
        return "Grievance deleted successfully";
    }
}
