package com.example.finapp.dto;

import com.example.finapp.entity.TransactionType;

import java.math.BigDecimal;

public class CategoryStatsDto {

    private final String category;
    private final TransactionType type;
    private final BigDecimal totalAmount;

    public CategoryStatsDto(String category, TransactionType type, BigDecimal totalAmount) {
        this.category = category;
        this.type = type;
        this.totalAmount = totalAmount;
    }

    public String getCategory() {
        return category;
    }

    public TransactionType getType() {
        return type;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
}
