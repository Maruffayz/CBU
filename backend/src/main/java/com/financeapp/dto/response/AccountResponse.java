package com.financeapp.dto.response;

import com.financeapp.enums.AccountType;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class AccountResponse {
    private UUID id;
    private String name;
    private AccountType type;
    private String currency;
    private BigDecimal balance;
    private String color;
    private boolean active;
}
