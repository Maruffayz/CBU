package com.financeapp.repositories;

import com.financeapp.entities.Account;
import com.financeapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUserAndActiveTrue(User user);
    Optional<Account> findByIdAndUser(UUID id, User user);
}
