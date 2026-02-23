package com.example.finance.service;

import com.example.finance.dto.ExpenseDto;
import com.example.finance.exception.NotFoundException;
import com.example.finance.model.Account;
import com.example.finance.model.Expense;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final AccountRepository accountRepository;

    public ExpenseService(ExpenseRepository expenseRepository, AccountRepository accountRepository) {
        this.expenseRepository = expenseRepository;
        this.accountRepository = accountRepository;
    }

    public List<ExpenseDto> getAll() {
        return expenseRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ExpenseDto getById(Long id) {
        return toDto(getEntity(id));
    }

    public ExpenseDto create(ExpenseDto dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));
        Expense expense = new Expense();
        expense.setAmount(dto.getAmount());
        expense.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        expense.setDescription(dto.getDescription());
        expense.setCategory(resolveCategory(dto.getCategory(), dto.getDescription()));
        expense.setAccount(account);

        Expense saved = expenseRepository.save(expense);
        account.setBalance(account.getBalance().subtract(expense.getAmount()));
        accountRepository.save(account);

        return toDto(saved);
    }

    public ExpenseDto update(Long id, ExpenseDto dto) {
        Expense existing = getEntity(id);
        Account account = existing.getAccount();

        // revert previous amount
        account.setBalance(account.getBalance().add(existing.getAmount()));

        existing.setAmount(dto.getAmount());
        existing.setDate(dto.getDate());
        existing.setDescription(dto.getDescription());
        existing.setCategory(resolveCategory(dto.getCategory(), dto.getDescription()));

        // apply new amount
        account.setBalance(account.getBalance().subtract(existing.getAmount()));
        accountRepository.save(account);

        return toDto(expenseRepository.save(existing));
    }

    public void delete(Long id) {
        Expense existing = getEntity(id);
        Account account = existing.getAccount();
        account.setBalance(account.getBalance().add(existing.getAmount()));
        accountRepository.save(account);
        expenseRepository.delete(existing);
    }

    public List<Expense> getByDateRange(LocalDate start, LocalDate end) {
        return expenseRepository.findByDateBetween(start, end);
    }

    public List<Expense> getByCategoryAndDateRange(String category, LocalDate start, LocalDate end) {
        return expenseRepository.findByCategoryAndDateBetween(category, start, end);
    }

    private Expense getEntity(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
    }

    private ExpenseDto toDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setDate(expense.getDate());
        dto.setDescription(expense.getDescription());
        dto.setCategory(expense.getCategory());
        dto.setAccountId(expense.getAccount() != null ? expense.getAccount().getId() : null);
        return dto;
    }

    // Rule-based categorization for utilities
    private String resolveCategory(String category, String description) {
        if (category != null && !category.isBlank()) {
            return category;
        }
        if (description == null) {
            return "Uncategorized";
        }
        String lower = description.toLowerCase(Locale.ROOT);
        if (lower.contains("electricity") || lower.contains("water") || lower.contains("gas")) {
            return "Utilities";
        }
        return "Uncategorized";
    }
}
