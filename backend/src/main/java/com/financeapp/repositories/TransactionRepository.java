package com.financeapp.repositories;

import com.financeapp.entities.Transaction;
import com.financeapp.entities.User;
import com.financeapp.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserOrderByDateDesc(User user);

    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate from, LocalDate to);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumByUserAndTypeAndMonthAndYear(@Param("user") User user, @Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.date BETWEEN :from AND :to GROUP BY t.category.name ORDER BY SUM(t.amount) DESC")
    List<Object[]> getCategorySpending(@Param("user") User user, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT MONTH(t.date), SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type AND YEAR(t.date) = :year GROUP BY MONTH(t.date) ORDER BY MONTH(t.date)")
    List<Object[]> getMonthlyTotals(@Param("user") User user, @Param("type") TransactionType type, @Param("year") int year);

    Optional<Transaction> findByIdAndUser(UUID id, User user);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.date = :date ORDER BY t.createdAt DESC")
    List<Transaction> findByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);
}
