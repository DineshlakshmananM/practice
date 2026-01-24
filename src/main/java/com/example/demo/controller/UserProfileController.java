package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.entity.LearningProgress;
import com.example.demo.dto.ProfileResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.LearningProgressRepository;
import com.example.demo.repository.PracticeHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ProfileResponse getProfile(@PathVariable Long userId) {

        // ✅ Explicit null check (kills IDE warning properly)
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }

        // ✅ Convert once, safely
        long safeUserId = userId;

        User user = userRepository.findById(safeUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse response = new ProfileResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setProfileImage(user.getProfileImage());
        response.setProvider(user.getProvider());

        response.setProblemsSolved(user.getProblemsSolved());
        response.setLearningStreak(user.getLearningStreak());
        response.setSkillRating(user.getSkillRating());
        response.setSkills(user.getSkills());

        response.setCreatedAt(user.getCreatedAt());
        response.setLastLogin(user.getLastLogin());

        // ✅ Calculate difficulty-based progress
        List<LearningProgress> allProgress = learningRepo.findByUserId(safeUserId);
        
        // Count Easy topics (C, Introduction topics)
        long easyCompleted = allProgress.stream()
                .filter(p -> (p.getLanguage().equals("C") || p.getTopic().toLowerCase().contains("introduction")) && p.isCompleted())
                .count();
        long easyTotal = allProgress.stream()
                .filter(p -> p.getLanguage().equals("C") || p.getTopic().toLowerCase().contains("introduction"))
                .count();
        
        // Count Medium topics (Java, CPP, MySQL)
        long mediumCompleted = allProgress.stream()
                .filter(p -> (p.getLanguage().equals("JAVA") || p.getLanguage().equals("CPP") || p.getLanguage().equals("MYSQL")) && p.isCompleted())
                .count();
        long mediumTotal = allProgress.stream()
                .filter(p -> p.getLanguage().equals("JAVA") || p.getLanguage().equals("CPP") || p.getLanguage().equals("MYSQL"))
                .count();
        
        // Count Hard topics (Advanced topics)
        long hardCompleted = allProgress.stream()
                .filter(p -> (p.getTopic().toLowerCase().contains("advanced") || p.getTopic().toLowerCase().contains("pointer") || p.getTopic().toLowerCase().contains("inheritance")) && p.isCompleted())
                .count();
        long hardTotal = allProgress.stream()
                .filter(p -> p.getTopic().toLowerCase().contains("advanced") || p.getTopic().toLowerCase().contains("pointer") || p.getTopic().toLowerCase().contains("inheritance"))
                .count();

        response.setEasyStats(new ProfileResponse.DifficultyStats((int) easyCompleted, (int) easyTotal));
        response.setMediumStats(new ProfileResponse.DifficultyStats((int) mediumCompleted, (int) mediumTotal));
        response.setHardStats(new ProfileResponse.DifficultyStats((int) hardCompleted, (int) hardTotal));

        response.setLearningCount(allProgress.size());
        response.setPracticeCount((int) practiceRepo.findByUserId(safeUserId).stream().count());

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
