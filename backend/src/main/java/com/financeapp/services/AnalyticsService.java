package com.financeapp.services;

import com.financeapp.entities.User;
import com.financeapp.enums.TransactionType;
import com.financeapp.repositories.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final TransactionRepository transactionRepository;

    public Map<String, Object> getDashboard(User user) {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue(), year = now.getYear();
        BigDecimal income = transactionRepository.sumByUserAndTypeAndMonthAndYear(user, TransactionType.INCOME, month, year);
        BigDecimal expense = transactionRepository.sumByUserAndTypeAndMonthAndYear(user, TransactionType.EXPENSE, month, year);
        Map<String, Object> result = new HashMap<>();
        result.put("monthlyIncome", income);
        result.put("monthlyExpense", expense);
        result.put("netSavings", income.subtract(expense));
        result.put("categorySpending", getCategorySpending(user, now.withDayOfMonth(1), now));
        result.put("monthlyTrend", getMonthlyTrend(user, year));
        return result;
    }

    public List<Map<String, Object>> getCategorySpending(User user, LocalDate from, LocalDate to) {
        List<Object[]> raw = transactionRepository.getCategorySpending(user, from, to);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("category", row[0]);
            entry.put("amount", row[1]);
            result.add(entry);
        }
        return result;
    }

    public Map<String, List<Map<String, Object>>> getMonthlyTrend(User user, int year) {
        List<Object[]> incomeRaw = transactionRepository.getMonthlyTotals(user, TransactionType.INCOME, year);
        List<Object[]> expenseRaw = transactionRepository.getMonthlyTotals(user, TransactionType.EXPENSE, year);
        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        result.put("income", formatMonthly(incomeRaw));
        result.put("expense", formatMonthly(expenseRaw));
        return result;
    }

    private List<Map<String, Object>> formatMonthly(List<Object[]> raw) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", row[0]);
            entry.put("amount", row[1]);
            list.add(entry);
        }
        return list;
    }

    public List<Map<String, Object>> getCalendarData(User user, int year, int month) {
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());
        List<Map<String, Object>> result = new ArrayList<>();
        transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, from, to).forEach(t -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", t.getDate());
            entry.put("type", t.getType());
            entry.put("amount", t.getAmount());
            entry.put("description", t.getDescription());
            result.add(entry);
        });
        return result;
    }
}
