package com.example.auth_service.service;

import com.example.auth_service.repository.UserCredentialRepository;
import com.example.auth_service.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserCredentialRepository repository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserCredentialRepository repository,
                       BCryptPasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(String username, String password) {
        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password are required");
        }

        return repository.findByUsername(username)
                .filter(u -> encoder.matches(password, u.getPassword()))
                .map(u -> jwtUtil.generateToken(username))
                .orElseThrow(() ->
                        new RuntimeException("Invalid credentials"));
    }
    
}
