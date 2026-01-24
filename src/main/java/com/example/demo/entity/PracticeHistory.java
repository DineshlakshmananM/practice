package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "practice_history")
public class PracticeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // ================= PRACTICE DATA =================
    @Column(nullable = false)
    private String language;        // JAVA, C, CPP, MYSQL

    @Column(name = "problem_name", nullable = false)
    private String problemName;

    @Column(nullable = false)
    private boolean solved;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "solved_at")
    private LocalDateTime solvedAt;

    // ================= JPA HOOK =================
    @PrePersist
    @PreUpdate
    protected void onSolve() {
        if (this.solved && this.solvedAt == null) {
            this.solvedAt = LocalDateTime.now();
        }
    }

    public PracticeHistory() {
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

    public String getProblemName() {
        return problemName;
    }

    public void setProblemName(String problemName) {
        this.problemName = problemName;
    }

    public boolean isSolved() {
        return solved;
    }

    public void setSolved(boolean solved) {
        this.solved = solved;
        if (solved && this.solvedAt == null) {
            this.solvedAt = LocalDateTime.now();
        }
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public LocalDateTime getSolvedAt() {
        return solvedAt;
    }

    public void setSolvedAt(LocalDateTime solvedAt) {
        this.solvedAt = solvedAt;
    }
}
