package com.example.finapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
public class Debt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String personName;

    @Column(precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private DebtStatus status = DebtStatus.OPEN;

    // true = they owe me, false = I owe them
    private boolean owedToMe;

    private LocalDate createdDate;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}
