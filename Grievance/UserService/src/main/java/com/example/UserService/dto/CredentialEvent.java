package com.example.UserService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CredentialEvent {
    private String username;
    private String password;
}
