package com.financeapp.dto.response;
import com.financeapp.enums.DebtStatus;
import com.financeapp.enums.DebtType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data @Builder
public class DebtResponse {
    private UUID id;
    private String personName;
    private DebtType type;
    private BigDecimal amount;
    private LocalDate date;
    private LocalDate dueDate;
    private String description;
    private DebtStatus status;
}
