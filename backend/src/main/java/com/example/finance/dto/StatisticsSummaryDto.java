package com.example.finance.dto;

import java.math.BigDecimal;
import java.util.Map;

public class StatisticsSummaryDto {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netBalance;

    private Map<String, BigDecimal> expenseByCategory;
    private Map<String, BigDecimal> incomeByCategory;

    private Map<String, BigDecimal> monthlyIncome;
    private Map<String, BigDecimal> monthlyExpense;

    private Map<Integer, BigDecimal> yearlyIncome;
    private Map<Integer, BigDecimal> yearlyExpense;

    public StatisticsSummaryDto() {
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getNetBalance() {
        return netBalance;
    }

    public void setNetBalance(BigDecimal netBalance) {
        this.netBalance = netBalance;
    }

    public Map<String, BigDecimal> getExpenseByCategory() {
        return expenseByCategory;
    }

    public void setExpenseByCategory(Map<String, BigDecimal> expenseByCategory) {
        this.expenseByCategory = expenseByCategory;
    }

    public Map<String, BigDecimal> getIncomeByCategory() {
        return incomeByCategory;
    }

    public void setIncomeByCategory(Map<String, BigDecimal> incomeByCategory) {
        this.incomeByCategory = incomeByCategory;
    }

    public Map<String, BigDecimal> getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Map<String, BigDecimal> monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Map<String, BigDecimal> getMonthlyExpense() {
        return monthlyExpense;
    }

    public void setMonthlyExpense(Map<String, BigDecimal> monthlyExpense) {
        this.monthlyExpense = monthlyExpense;
    }

    public Map<Integer, BigDecimal> getYearlyIncome() {
        return yearlyIncome;
    }

    public void setYearlyIncome(Map<Integer, BigDecimal> yearlyIncome) {
        this.yearlyIncome = yearlyIncome;
    }

    public Map<Integer, BigDecimal> getYearlyExpense() {
        return yearlyExpense;
    }

    public void setYearlyExpense(Map<Integer, BigDecimal> yearlyExpense) {
        this.yearlyExpense = yearlyExpense;
    }
}
