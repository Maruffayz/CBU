package com.financeapp.dto.request;

import com.financeapp.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class BudgetRequest {
    private UUID categoryId;
    @NotNull private TransactionType type;
    @NotNull @Positive private BigDecimal amount;
    @NotNull private Integer month;
    @NotNull private Integer year;
}
