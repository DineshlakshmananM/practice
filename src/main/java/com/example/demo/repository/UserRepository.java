package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ===== EXISTING (DO NOT BREAK FRONTEND) =====
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    // ===== NEW (SAFE + REQUIRED FOR SCALE) =====

    // Faster checks (used during register)
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // Google / provider-based login support
    Optional<User> findByEmailAndProvider(String email, String provider);
}
