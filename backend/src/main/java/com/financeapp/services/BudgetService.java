package com.financeapp.services;

import com.financeapp.dto.request.BudgetRequest;
import com.financeapp.entities.*;
import com.financeapp.enums.TransactionType;
import com.financeapp.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public List<Map<String, Object>> getBudgetsWithProgress(User user, int month, int year) {
        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Budget b : budgets) {
            LocalDate from = LocalDate.of(year, month, 1);
            LocalDate to = from.withDayOfMonth(from.lengthOfMonth());
            BigDecimal actual = transactionRepository.sumByUserAndTypeAndMonthAndYear(user, b.getType(), month, year);
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", b.getId()); entry.put("type", b.getType());
            entry.put("budgeted", b.getAmount()); entry.put("actual", actual);
            entry.put("remaining", b.getAmount().subtract(actual));
            entry.put("percentage", b.getAmount().compareTo(BigDecimal.ZERO) > 0
                ? actual.multiply(BigDecimal.valueOf(100)).divide(b.getAmount(), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
            if (b.getCategory() != null) {
                entry.put("categoryId", b.getCategory().getId());
                entry.put("categoryName", b.getCategory().getName());
                entry.put("categoryIcon", b.getCategory().getIcon());
            }
            result.add(entry);
        }
        return result;
    }

    @Transactional
    public Budget createBudget(User user, BudgetRequest req) {
        Category category = req.getCategoryId() != null
            ? categoryRepository.findById(req.getCategoryId()).orElse(null) : null;
        Budget budget = Budget.builder()
            .user(user).category(category).type(req.getType())
            .amount(req.getAmount()).month(req.getMonth()).year(req.getYear()).build();
        return budgetRepository.save(budget);
    }
}
