package com.financeapp.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data @Builder
public class TransferResponse {
    private UUID id;
    private UUID fromAccountId;
    private String fromAccountName;
    private UUID toAccountId;
    private String toAccountName;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
    private BigDecimal convertedAmount;
    private String description;
    private LocalDate date;
}
