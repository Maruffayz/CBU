package com.financeapp.entities;

import com.financeapp.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    private String icon = "💰";
    private String color = "#6366f1";

    @Column(name = "is_default")
    private boolean isDefault = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
