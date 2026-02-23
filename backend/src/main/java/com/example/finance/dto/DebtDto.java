package com.example.finance.dto;

import com.example.finance.model.DebtStatus;
import com.example.finance.model.DebtType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DebtDto {
    private Long id;
    private String personName;
    private BigDecimal amount;
    private DebtType type;
    private DebtStatus status;
    private LocalDate dueDate;

    public DebtDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public DebtType getType() {
        return type;
    }

    public void setType(DebtType type) {
        this.type = type;
    }

    public DebtStatus getStatus() {
        return status;
    }

    public void setStatus(DebtStatus status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
