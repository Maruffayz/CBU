package com.financeapp.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TransactionRequest {
    @NotNull @Positive private BigDecimal amount;
    @NotNull private LocalDate date;
    private String description;
    private UUID categoryId;
    @NotNull private UUID accountId;
}
