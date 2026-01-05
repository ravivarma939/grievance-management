package com.example.grievanceService.service;

import com.example.grievanceService.entity.GrievanceData;
import com.example.grievanceService.repo.GrievanceRepo;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GrievanceService {

    private final GrievanceRepo repo;

    public GrievanceService(GrievanceRepo repo) {
        this.repo = repo;
    }

    public GrievanceData save(GrievanceData grievance) {
        return repo.save(grievance);
    }

    public List<GrievanceData> getAllGrievances() {
        return repo.findAll();
    }

    public List<GrievanceData> filter(String issueType, String company) {
        return repo.findByIssueTypeAndCompany(issueType, company);
    }

    public GrievanceData update(Long grievanceId, GrievanceData req) {
        return repo.findById(grievanceId)
                .map(existing -> {
                    existing.setUsername(req.getUsername());
                    existing.setCompany(req.getCompany());
                    existing.setIssueType(req.getIssueType());
                    existing.setState(req.getState());
                    return repo.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Grievance not found"));
    }

    public void delete(Long grievanceId) {
        if (!repo.existsById(grievanceId)) {
            throw new RuntimeException("Grievance not found");
        }
        repo.deleteById(grievanceId);
    }
}
