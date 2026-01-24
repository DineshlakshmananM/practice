package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_progress")
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // ================= LEARNING DATA =================
    @Column(nullable = false)
    private String language;   // JAVA, C, CPP, MYSQL

    @Column(nullable = false)
    private String topic;      // OOP, LOOPS, JOIN

    @Column(nullable = false)
    private int progress;      // 0 - 100

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    // ================= JPA HOOK =================
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastAccessed = LocalDateTime.now();
    }

    public LearningProgress() {
    }

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
        this.completed = progress >= 100;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(LocalDateTime lastAccessed) {
        this.lastAccessed = lastAccessed;
    }
}
