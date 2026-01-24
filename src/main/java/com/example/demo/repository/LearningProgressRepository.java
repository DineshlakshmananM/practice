package com.example.demo.repository;

import com.example.demo.entity.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {
    List<LearningProgress> findByUserId(Long userId);
}
