package com.financeapp.dto.response;

import com.financeapp.enums.TransactionType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TransactionResponse {
    private UUID id;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private UUID accountId;
    private String accountName;
    private UUID categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
}
