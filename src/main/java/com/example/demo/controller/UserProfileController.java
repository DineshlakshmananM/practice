package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.LearningProgressRepository;
import com.example.demo.repository.PracticeHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserRepository userRepository;
    private final LearningProgressRepository learningRepo;
    private final PracticeHistoryRepository practiceRepo;

    public UserProfileController(
            UserRepository userRepository,
            LearningProgressRepository learningRepo,
            PracticeHistoryRepository practiceRepo
    ) {
        this.userRepository = userRepository;
        this.learningRepo = learningRepo;
        this.practiceRepo = practiceRepo;
    }

    // ================= USER PROFILE =================
    @GetMapping("/profile/{userId}")
    public Map<String, Object> getProfile(@PathVariable Long userId) {

        // ✅ Explicit null check (kills IDE warning properly)
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }

        // ✅ Convert once, safely
        long safeUserId = userId;

        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();

        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("profileImage", user.getProfileImage());
        response.put("provider", user.getProvider());

        response.put("problemsSolved", user.getProblemsSolved());
        response.put("learningStreak", user.getLearningStreak());
        response.put("skillRating", user.getSkillRating());
        response.put("skills", user.getSkills());

        response.put("createdAt", user.getCreatedAt());
        response.put("lastLogin", user.getLastLogin());

        // ✅ Use the safe primitive-backed ID everywhere
        response.put("learningProgress",
                learningRepo.findByUserId(safeUserId));

        response.put("practiceHistory",
                practiceRepo.findByUserId(safeUserId));

        return response;
    }

    // ================= LEARNING PROGRESS =================
    @GetMapping("/progress/{userId}")
    public java.util.List<?> getLearningProgress(@PathVariable Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        return learningRepo.findByUserId(userId);
    }

    // ================= PRACTICE HISTORY =================
    @GetMapping("/practice/{userId}")
    public java.util.List<?> getPracticeHistory(@PathVariable Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        return practiceRepo.findByUserId(userId);
    }
}
