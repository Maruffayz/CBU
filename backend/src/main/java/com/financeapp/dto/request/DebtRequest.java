package com.financeapp.dto.request;

import com.financeapp.enums.DebtType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DebtRequest {
    @NotNull private DebtType type;
    @NotBlank private String personName;
    @NotNull @Positive private BigDecimal amount;
    private String description;
    private LocalDate dueDate;
}
