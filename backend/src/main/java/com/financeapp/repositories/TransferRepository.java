package com.financeapp.repositories;

import com.financeapp.entities.Transfer;
import com.financeapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TransferRepository extends JpaRepository<Transfer, UUID> {
    List<Transfer> findByUserOrderByDateDesc(User user);
}
