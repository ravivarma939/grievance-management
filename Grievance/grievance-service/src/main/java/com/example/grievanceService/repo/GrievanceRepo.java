package com.example.grievanceService.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.grievanceService.entity.GrievanceData;

public interface GrievanceRepo extends JpaRepository<GrievanceData, Long> {

    List<GrievanceData> findByIssueTypeAndCompany(String issueType, String company);

}
