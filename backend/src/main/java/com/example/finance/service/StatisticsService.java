package com.example.finance.service;

import com.example.finance.dto.StatisticsSummaryDto;
import com.example.finance.model.Expense;
import com.example.finance.model.Income;
import com.example.finance.repository.ExpenseRepository;
import com.example.finance.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StatisticsService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public StatisticsService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public StatisticsSummaryDto getSummary() {
        List<Expense> expenses = expenseRepository.findAll();
        List<Income> incomes = incomeRepository.findAll();

        StatisticsSummaryDto dto = new StatisticsSummaryDto();

        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalIncome(totalIncome);
        dto.setTotalExpense(totalExpense);
        dto.setNetBalance(totalIncome.subtract(totalExpense));

        dto.setExpenseByCategory(groupByCategoryExpenses(expenses));
        dto.setIncomeByCategory(groupByCategoryIncome(incomes));
        dto.setMonthlyIncome(groupMonthlyIncome(incomes));
        dto.setMonthlyExpense(groupMonthlyExpense(expenses));
        dto.setYearlyIncome(groupYearlyIncome(incomes));
        dto.setYearlyExpense(groupYearlyExpense(expenses));

        return dto;
    }

    private Map<String, BigDecimal> groupByCategoryExpenses(List<Expense> expenses) {
        return expenses.stream().collect(Collectors.groupingBy(Expense::getCategory,
                Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Map<String, BigDecimal> groupByCategoryIncome(List<Income> incomes) {
        return incomes.stream().collect(Collectors.groupingBy(Income::getCategory,
                Collectors.mapping(Income::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Map<String, BigDecimal> groupMonthlyIncome(List<Income> incomes) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        return incomes.stream().collect(Collectors.groupingBy(i -> i.getDate().format(formatter),
                Collectors.mapping(Income::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Map<String, BigDecimal> groupMonthlyExpense(List<Expense> expenses) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        return expenses.stream().collect(Collectors.groupingBy(e -> e.getDate().format(formatter),
                Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Map<Integer, BigDecimal> groupYearlyIncome(List<Income> incomes) {
        return incomes.stream().collect(Collectors.groupingBy(i -> i.getDate().getYear(),
                Collectors.mapping(Income::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Map<Integer, BigDecimal> groupYearlyExpense(List<Expense> expenses) {
        return expenses.stream().collect(Collectors.groupingBy(e -> e.getDate().getYear(),
                Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }
}
