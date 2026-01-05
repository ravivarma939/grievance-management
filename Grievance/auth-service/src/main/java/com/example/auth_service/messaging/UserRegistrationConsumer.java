package com.example.auth_service.messaging;

import com.example.auth_service.dto.CredentialEvent;
import com.example.auth_service.entity.UserCredential;
import com.example.auth_service.repository.UserCredentialRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class UserRegistrationConsumer {

    private final UserCredentialRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
//    private final BCryptPasswordEncoder encoder;
    public UserRegistrationConsumer(UserCredentialRepository repository,
                                    BCryptPasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @KafkaListener(
            topics = "user-registration-topic",
            groupId = "auth-group-v2"
    )
    public void consume(Map<String, String> message) {

        String username = message.get("username");
        String password = message.get("password");

        UserCredential credential = new UserCredential();
        credential.setUsername(username);
        credential.setPassword(passwordEncoder.encode(password));
        System.out.println("Consumed user registration for username: " + username);
        System.out.println("Encoded password: " + credential.getPassword());

        repository.save(credential);
    }

//    public UserRegistrationConsumer(UserCredentialRepository repository,
//                                    BCryptPasswordEncoder encoder) {
//        this.repository = repository;
//        this.encoder = encoder;
//    }
//
//    @KafkaListener(topics = "user-registration-topic", groupId = "auth-group")
//    public void consume(CredentialEvent event) {
//
//        UserCredential credential = new UserCredential();
//        credential.setUsername(event.getUsername());
//        credential.setPassword(
//                encoder.encode(event.getPassword())
//        );
//
//        repository.save(credential);
//    }
}