package com.example.UserService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.UserService.entity.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

	Optional<UserProfile> findByUsername(String username);
}
