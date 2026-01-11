package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        Map<String, Object> response = new HashMap<>();

        // Check email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }

        // Check username
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // plain text (learning phase)
        user.setProfileImage(null); // future use

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
                    if (!user.getPassword().equals(request.getPassword())) {
                        response.put("success", false);
                        response.put("message", "Invalid email or password");
                        return ResponseEntity.badRequest().body(response);
                    }

                    // Login success → return user details
                    response.put("success", true);
                    response.put("message", "Login successful");

                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("username", user.getUsername());
                    userData.put("email", user.getEmail());
                    userData.put("profileImage", user.getProfileImage());

                    response.put("user", userData);

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Invalid email or password");
                    return ResponseEntity.badRequest().body(response);
                });
    }
}
