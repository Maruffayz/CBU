package com.example.finapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private AccountType type;

    // ISO currency code, e.g. "USD", "UZS"
    private String currency;

    @Column(precision = 19, scale = 4)
    private BigDecimal balance = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "family_group_id")
    private FamilyGroup familyGroup;

    @OneToMany(mappedBy = "sourceAccount")
    private List<Transaction> outgoingTransactions;

    @OneToMany(mappedBy = "targetAccount")
    private List<Transaction> incomingTransactions;
}
