package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        Map<String, Object> response = new HashMap<>();

        // Email check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }

        // Username check
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hashed password
        user.setProvider("LOCAL");
        user.setProfileImage(null);
        // createdAt handled by @PrePersist

        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Registration successful");

        return ResponseEntity.ok(response);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Map<String, Object> response = new HashMap<>();

        return userRepository.findByEmail(request.getEmail())
                .map(user -> {

                    if (user.getPassword() == null ||
                        !passwordEncoder.matches(request.getPassword(), user.getPassword())) {

                        response.put("success", false);
                        response.put("message", "Invalid email or password");
                        return ResponseEntity.badRequest().body(response);
                    }

                    // Update last login time
                    user.setLastLogin(LocalDateTime.now());
                    userRepository.save(user);

                    response.put("success", true);
                    response.put("message", "Login successful");

                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("username", user.getUsername());
                    userData.put("email", user.getEmail());
                    userData.put("profileImage", user.getProfileImage());
                    userData.put("provider", user.getProvider());
                    userData.put("createdAt", user.getCreatedAt());

                    response.put("user", userData);

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Invalid email or password");
                    return ResponseEntity.badRequest().body(response);
                });
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}
