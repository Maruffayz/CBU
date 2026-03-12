package com.financeapp.repositories;

import com.financeapp.entities.Category;
import com.financeapp.entities.User;
import com.financeapp.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    @Query("SELECT c FROM Category c WHERE c.user = :user OR c.user IS NULL")
    List<Category> findByUserOrDefault(User user);

    @Query("SELECT c FROM Category c WHERE (c.user = :user OR c.user IS NULL) AND c.type = :type")
    List<Category> findByUserOrDefaultAndType(User user, TransactionType type);
}
