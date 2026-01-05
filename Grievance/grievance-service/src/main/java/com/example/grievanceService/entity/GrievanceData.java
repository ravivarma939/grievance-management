package com.example.grievanceService.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "grievance_data")
public class GrievanceData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long grievanceId;

    private String username;
    private String company;
    private String issueType;
    private String state;

    public GrievanceData() {}

    public Long getGrievanceId() {
        return grievanceId;
    }

    public void setGrievanceId(Long grievanceId) {
        this.grievanceId = grievanceId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
