package com.studypulse.repository;

import com.studypulse.entity.ProductivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface ProductivityLogRepository extends JpaRepository<ProductivityLog, Long> {
    Optional<ProductivityLog> findByUserIdAndDate(Long userId, LocalDate date);
    List<ProductivityLog> findByUserIdAndDateBetweenOrderByDateAsc(Long userId, LocalDate startDate, LocalDate endDate);
}
