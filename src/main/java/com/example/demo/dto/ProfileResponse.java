package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ProfileResponse {

    // ===== BASIC USER INFO =====
    private Long id;
    private String username;
    private String email;
    private String profileImage;
    private String provider;

    // ===== LEARNING & PRACTICE STATS =====
    private int problemsSolved;
    private int learningStreak;
    private double skillRating;
    private String skills; // comma-separated

    // ===== ACTIVITY COUNTS =====
    private int learningCount;
    private int practiceCount;

    // ===== DIFFICULTY-BASED PROGRESS (Easy, Medium, Hard) =====
    private DifficultyStats easyStats;
    private DifficultyStats mediumStats;
    private DifficultyStats hardStats;

    // ===== AUDIT =====
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // ===== OPTIONAL HISTORY (future-ready) =====
    private List<String> recentLearnings;
    private List<String> recentPractices;

    public ProfileResponse() {
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfileImage() {
        return profileImage;
    }
    
    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }

    public int getProblemsSolved() {
        return problemsSolved;
    }

    public void setProblemsSolved(int problemsSolved) {
        this.problemsSolved = problemsSolved;
    }

    public int getLearningStreak() {
        return learningStreak;
    }

    public void setLearningStreak(int learningStreak) {
        this.learningStreak = learningStreak;
    }

    public double getSkillRating() {
        return skillRating;
    }

    public void setSkillRating(double skillRating) {
        this.skillRating = skillRating;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public int getLearningCount() {
        return learningCount;
    }

    public void setLearningCount(int learningCount) {
        this.learningCount = learningCount;
    }

    public int getPracticeCount() {
        return practiceCount;
    }

    public void setPracticeCount(int practiceCount) {
        this.practiceCount = practiceCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<String> getRecentLearnings() {
        return recentLearnings;
    }

    public void setRecentLearnings(List<String> recentLearnings) {
        this.recentLearnings = recentLearnings;
    }

    public List<String> getRecentPractices() {
        return recentPractices;
    }

    public void setRecentPractices(List<String> recentPractices) {
        this.recentPractices = recentPractices;
    }

    public DifficultyStats getEasyStats() {
        return easyStats;
    }

    public void setEasyStats(DifficultyStats easyStats) {
        this.easyStats = easyStats;
    }

    public DifficultyStats getMediumStats() {
        return mediumStats;
    }

    public void setMediumStats(DifficultyStats mediumStats) {
        this.mediumStats = mediumStats;
    }

    public DifficultyStats getHardStats() {
        return hardStats;
    }

    public void setHardStats(DifficultyStats hardStats) {
        this.hardStats = hardStats;
    }

    // ===== INNER CLASS: Difficulty Stats =====
    public static class DifficultyStats {
        private int completed;    // Completed topics count
        private int total;        // Total topics in this difficulty
        private double percentage; // Percentage completed (0-100)

        public DifficultyStats() {
        }

        public DifficultyStats(int completed, int total) {
            this.completed = completed;
            this.total = total;
            this.percentage = total > 0 ? (completed * 100.0 / total) : 0;
        }

        public int getCompleted() {
            return completed;
        }

        public void setCompleted(int completed) {
            this.completed = completed;
            updatePercentage();
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
            updatePercentage();
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }

        private void updatePercentage() {
            this.percentage = total > 0 ? (completed * 100.0 / total) : 0;
        }
    }
}
