package com.financeapp.dto.request;

import com.financeapp.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountRequest {
    @NotBlank private String name;
    @NotNull private AccountType type;
    private String currency = "USD";
    private BigDecimal balance = BigDecimal.ZERO;
    private String color = "#6366f1";
}
