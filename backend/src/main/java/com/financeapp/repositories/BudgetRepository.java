package com.financeapp.repositories;

import com.financeapp.entities.Budget;
import com.financeapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByUserAndMonthAndYear(User user, int month, int year);
    List<Budget> findByUser(User user);
}
