package com.example.finapp.repository;

import com.example.finapp.dto.CategoryStatsDto;
import com.example.finapp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
        SELECT new com.example.finapp.dto.CategoryStatsDto(
            t.category, t.type, SUM(t.amount)
        )
        FROM Transaction t
        WHERE t.date BETWEEN :from AND :to
        GROUP BY t.category, t.type
        """)
    List<CategoryStatsDto> findTotalsByCategoryAndType(LocalDateTime from, LocalDateTime to);
}
