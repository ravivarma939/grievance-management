package com.example.UserService.service;

import com.example.UserService.dto.CredentialEvent;
import com.example.UserService.dto.UserRegistrationRequest;
import com.example.UserService.entity.UserProfile;
import com.example.UserService.repository.UserProfileRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class UserProfileService {

    private final UserProfileRepository repository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public UserProfileService(UserProfileRepository repository,
                              KafkaTemplate<String, Object> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public UserProfile registerUser(UserRegistrationRequest request) {

        UserProfile profile = new UserProfile();
        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setUsername(request.getUsername());
        profile.setState(request.getState());

//        UserProfile saved = repository.save(profile);

        // Publish credentials to Auth Service
//        kafkaTemplate.send(
//                "user-registration-topic",
//                new CredentialEvent(
//                        request.getUsername(),
//                        request.getPassword()
//                )
//        );
        UserProfile saved = repository.save(profile);

        // 🔑 Send plain JSON (Map) to Kafka — NO shared DTO
        Map<String, String> message = new HashMap<>();
        message.put("username", request.getUsername());
        message.put("password", request.getPassword());

        kafkaTemplate.send("user-registration-topic", message);


        return saved;
    }

	public Optional<UserProfile> findByUsername(String username) {
		
		return repository.findByUsername(username);
	}

	public UserProfile updateUser(UserProfile user) {
		
		return repository.save(user);
	}
}
