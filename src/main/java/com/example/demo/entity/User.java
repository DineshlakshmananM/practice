package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "username")
    }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC INFO =================

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    // Nullable for GOOGLE users
    @Column
    private String password;

    // Full name for display
    @Column(name = "full_name")
    private String fullName;

    // LOCAL / GOOGLE
    @Column(nullable = false)
    private String provider;

    // USER / ADMIN
    @Column(nullable = false)
    private String role = "USER";

    // Profile image URL or file name
    @Column(name = "profile_image")
    private String profileImage;

    // ================= LEARNING PROFILE =================

    // Total problems solved (LeetCode-style)
    @Column(name = "problems_solved", nullable = false)
    private int problemsSolved = 0;

    // Total submissions
    @Column(name = "total_submissions", nullable = false)
    private int totalSubmissions = 0;

    // Accepted submissions
    @Column(name = "accepted_submissions", nullable = false)
    private int acceptedSubmissions = 0;

    // Easy/Medium/Hard solved counts
    @Column(name = "easy_solved", nullable = false)
    private int easySolved = 0;

    @Column(name = "medium_solved", nullable = false)
    private int mediumSolved = 0;

    @Column(name = "hard_solved", nullable = false)
    private int hardSolved = 0;

    // Learning streak (days)
    @Column(name = "learning_streak", nullable = false)
    private int learningStreak = 0;

    // Overall skill rating (0–5)
    @Column(name = "skill_rating", nullable = false)
    private double skillRating = 0.0;

    // Global ranking
    @Column(name = "global_rank")
    private Integer globalRank;

    // Languages learned (comma-separated: JAVA,PYTHON,C,CPP,HTML,CSS,JS,MYSQL)
    @Column(length = 500)
    private String skills;

    // Topics completed count
    @Column(name = "topics_completed", nullable = false)
    private int topicsCompleted = 0;

    // ================= AUDIT =================

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    public User() {
        // default provider for normal signup
        this.provider = "LOCAL";
    }

    // ================= JPA HOOK =================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ================= GETTERS & SETTERS =================

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

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProfileImage() {
        return profileImage;
    }
    
    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public int getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(int totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public int getAcceptedSubmissions() {
        return acceptedSubmissions;
    }

    public void setAcceptedSubmissions(int acceptedSubmissions) {
        this.acceptedSubmissions = acceptedSubmissions;
    }

    public int getEasySolved() {
        return easySolved;
    }

    public void setEasySolved(int easySolved) {
        this.easySolved = easySolved;
    }

    public int getMediumSolved() {
        return mediumSolved;
    }

    public void setMediumSolved(int mediumSolved) {
        this.mediumSolved = mediumSolved;
    }

    public int getHardSolved() {
        return hardSolved;
    }

    public void setHardSolved(int hardSolved) {
        this.hardSolved = hardSolved;
    }

    public Integer getGlobalRank() {
        return globalRank;
    }

    public void setGlobalRank(Integer globalRank) {
        this.globalRank = globalRank;
    }

    public int getTopicsCompleted() {
        return topicsCompleted;
    }

    public void setTopicsCompleted(int topicsCompleted) {
        this.topicsCompleted = topicsCompleted;
    }
}
