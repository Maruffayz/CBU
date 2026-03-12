package com.financeapp.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TransferRequest {
    @NotNull private UUID fromAccountId;
    @NotNull private UUID toAccountId;
    @NotNull @Positive private BigDecimal amount;
    private BigDecimal exchangeRate = BigDecimal.ONE;
    private String description;
}
