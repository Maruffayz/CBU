package com.example.finapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_group_id")
    private FamilyGroup familyGroup;

    private String category;

    private int year;

    private int month; // 1-12

    @Column(precision = 19, scale = 4)
    private BigDecimal limitAmount;
}
