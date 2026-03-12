package com.financeapp.dto.response;
import com.financeapp.enums.TransactionType;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data @Builder
public class CategoryResponse {
    private UUID id;
    private String name;
    private TransactionType type;
    private String icon;
    private String color;
    private boolean isSystem;
}
