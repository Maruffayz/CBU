package com.financeapp.repositories;

import com.financeapp.entities.Debt;
import com.financeapp.entities.User;
import com.financeapp.enums.DebtStatus;
import com.financeapp.enums.DebtType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DebtRepository extends JpaRepository<Debt, UUID> {
    List<Debt> findByUserOrderByCreatedAtDesc(User user);
    List<Debt> findByUserAndTypeAndStatus(User user, DebtType type, DebtStatus status);
    Optional<Debt> findByIdAndUser(UUID id, User user);
}
