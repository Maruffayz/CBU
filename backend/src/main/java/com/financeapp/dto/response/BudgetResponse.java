package com.financeapp.dto.response;
import com.financeapp.enums.TransactionType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data @Builder
public class BudgetResponse {
    private UUID id;
    private String name;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal spent;
    private BigDecimal percentage;
    private UUID categoryId;
    private String categoryName;
    private Integer month;
    private Integer year;
}
