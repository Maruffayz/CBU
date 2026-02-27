package com.example.finapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 19, scale = 4, nullable = false)
    private BigDecimal amount;

    private LocalDateTime date;

    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String category;

    // For INCOME / EXPENSE this is the affected account.
    // For TRANSFER this is the "from" account.
    @ManyToOne
    @JoinColumn(name = "source_account_id")
    private Account sourceAccount;

    // Only used for TRANSFER
    @ManyToOne
    @JoinColumn(name = "target_account_id")
    private Account targetAccount;

    // For transfers when currencies differ; null or 1 for same currency
    @Column(precision = 19, scale = 6)
    private BigDecimal exchangeRate;
}
