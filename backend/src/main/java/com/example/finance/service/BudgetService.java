package com.example.finance.service;

import com.example.finance.dto.BudgetDto;
import com.example.finance.exception.NotFoundException;
import com.example.finance.model.Budget;
import com.example.finance.model.Expense;
import com.example.finance.repository.BudgetRepository;
import com.example.finance.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    public List<BudgetDto> getAll() {
        return budgetRepository.findAll().stream().map(this::toDtoWithActual).collect(Collectors.toList());
    }

    public BudgetDto getById(Long id) {
        Budget budget = getEntity(id);
        return toDtoWithActual(budget);
    }

    public BudgetDto create(BudgetDto dto) {
        Budget budget = new Budget();
        budget.setMonth(dto.getMonth());
        budget.setYear(dto.getYear());
        budget.setCategory(dto.getCategory());
        budget.setLimitAmount(dto.getLimitAmount());
        Budget saved = budgetRepository.save(budget);
        return toDtoWithActual(saved);
    }

    public BudgetDto update(Long id, BudgetDto dto) {
        Budget budget = getEntity(id);
        budget.setMonth(dto.getMonth());
        budget.setYear(dto.getYear());
        budget.setCategory(dto.getCategory());
        budget.setLimitAmount(dto.getLimitAmount());
        return toDtoWithActual(budgetRepository.save(budget));
    }

    public void delete(Long id) {
        budgetRepository.deleteById(id);
    }

    public List<BudgetDto> getForMonth(int year, int month) {
        return budgetRepository.findByYearAndMonth(year, month)
                .stream()
                .map(this::toDtoWithActual)
                .collect(Collectors.toList());
    }

    private Budget getEntity(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Budget not found"));
    }

    private BudgetDto toDtoWithActual(Budget budget) {
        BudgetDto dto = new BudgetDto();
        dto.setId(budget.getId());
        dto.setMonth(budget.getMonth());
        dto.setYear(budget.getYear());
        dto.setCategory(budget.getCategory());
        dto.setLimitAmount(budget.getLimitAmount());

        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Expense> expenses = expenseRepository.findByCategoryAndDateBetween(budget.getCategory(), start, end);
        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setActualExpense(total);
        dto.setOverBudget(total.compareTo(budget.getLimitAmount()) > 0);
        return dto;
    }
}
