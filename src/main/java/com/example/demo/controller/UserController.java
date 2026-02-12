package com.example.demo.controller;

import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= GET PROFILE =================
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable @NonNull Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("profileImage", user.getProfileImage());
        userData.put("problemsSolved", user.getProblemsSolved());
        userData.put("learningStreak", user.getLearningStreak());
        userData.put("skillRating", user.getSkillRating());
        userData.put("skills", user.getSkills());
        userData.put("createdAt", user.getCreatedAt());
        userData.put("lastLogin", user.getLastLogin());
        userData.put("provider", user.getProvider());

        response.put("success", true);
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }

    // ================= UPDATE PROFILE =================
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable @NonNull Long userId, 
                                          @RequestBody ProfileUpdateRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        // Update username if provided
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            var existingUser = userRepository.findByUsername(request.getUsername());
            if (existingUser.isPresent() && 
                existingUser.map(u -> u.getId()).orElse(null) != null &&
                !existingUser.get().getId().equals(userId)) {
                response.put("success", false);
                response.put("message", "Username already taken");
                return ResponseEntity.badRequest().body(response);
            }
            user.setUsername(request.getUsername());
        }

        // Update email if provided
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            var existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                Long existingUserId = existingUser.map(u -> u.getId()).orElse(null);
                if (existingUserId != null && !existingUserId.equals(userId)) {
                    response.put("success", false);
                    response.put("message", "Email already in use");
                    return ResponseEntity.badRequest().body(response);
                }
            }
            user.setEmail(request.getEmail());
        }

        // Update profile image if provided
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        userRepository.save(user);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("profileImage", user.getProfileImage());

        response.put("success", true);
        response.put("message", "Profile updated successfully");
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }
}

