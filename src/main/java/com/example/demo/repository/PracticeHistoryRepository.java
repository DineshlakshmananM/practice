package com.example.demo.repository;

import com.example.demo.entity.PracticeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PracticeHistoryRepository extends JpaRepository<PracticeHistory, Long> {
    List<PracticeHistory> findByUserId(Long userId);
}
