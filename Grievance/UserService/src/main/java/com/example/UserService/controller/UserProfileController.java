package com.example.UserService.controller;

import com.example.UserService.dto.UserRegistrationRequest;
import com.example.UserService.entity.UserProfile;
import com.example.UserService.service.UserProfileService;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public UserProfile register(@RequestBody UserRegistrationRequest request) {
        return service.registerUser(request);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader(value = "X-Username", required = false) String username) {
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<UserProfile> userOptional = service.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        UserProfile user = userOptional.get();
        return ResponseEntity.ok(Map.of(
                "fullName", user.getFullName(),
                "username", user.getUsername(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "state", user.getState()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "X-Username", required = false) String username,
            @RequestBody Map<String, Object> request) {

        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<UserProfile> userOptional = service.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        UserProfile user = userOptional.get();

        String email = (String) request.get("email");
        String fullName = (String) request.get("fullName");
        String state = (String) request.get("state");

        if (email != null) user.setEmail(email);
        if (fullName != null) user.setFullName(fullName);
        if (state != null) user.setState(state);

        UserProfile updated = service.updateUser(user);

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "fullName", updated.getFullName(),
                "username", updated.getUsername(),
                "email", updated.getEmail() != null ? updated.getEmail() : "",
                "state", updated.getState()
        ));
    }

}
