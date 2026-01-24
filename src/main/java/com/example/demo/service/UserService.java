package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.entity.LearningProgress;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.LearningProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final LearningProgressRepository progressRepo;

    public UserService(UserRepository userRepo,
                       LearningProgressRepository progressRepo) {
        this.userRepo = userRepo;
        this.progressRepo = progressRepo;
    }

    public User login(User user) {
        user.setLastLogin(LocalDateTime.now());
        return userRepo.save(user);
    }

    public List<LearningProgress> getProgress(Long userId) {
        return progressRepo.findByUserId(userId);
    }
}
