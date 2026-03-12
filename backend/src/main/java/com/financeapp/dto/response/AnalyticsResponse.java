package com.financeapp.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @Builder
public class AnalyticsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private List<CategoryStat> categoryStats;
    private List<MonthlyStats> monthlyStats;
    private BigDecimal totalAssets;

    @Data @Builder
    public static class CategoryStat {
        private String categoryName;
        private String color;
        private BigDecimal amount;
        private double percentage;
    }

    @Data @Builder
    public static class MonthlyStats {
        private String month;
        private BigDecimal income;
        private BigDecimal expenses;
    }
}
