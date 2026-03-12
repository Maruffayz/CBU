package com.financeapp.services;

import com.financeapp.enums.TransactionType;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AutoCategorizationService {
    private static final Map<String, String> EXPENSE_RULES = Map.ofEntries(
        Map.entry("taxi", "Transport"), Map.entry("uber", "Transport"), Map.entry("lyft", "Transport"),
        Map.entry("bus", "Transport"), Map.entry("metro", "Transport"), Map.entry("fuel", "Transport"),
        Map.entry("electricity", "Utilities"), Map.entry("water", "Utilities"), Map.entry("gas", "Utilities"),
        Map.entry("internet", "Utilities"), Map.entry("phone", "Utilities"),
        Map.entry("grocery", "Food & Dining"), Map.entry("restaurant", "Food & Dining"),
        Map.entry("food", "Food & Dining"), Map.entry("coffee", "Food & Dining"), Map.entry("lunch", "Food & Dining"),
        Map.entry("netflix", "Entertainment"), Map.entry("spotify", "Entertainment"),
        Map.entry("movie", "Entertainment"), Map.entry("cinema", "Entertainment"),
        Map.entry("amazon", "Shopping"), Map.entry("shop", "Shopping"), Map.entry("store", "Shopping"),
        Map.entry("hospital", "Healthcare"), Map.entry("pharmacy", "Healthcare"), Map.entry("doctor", "Healthcare"),
        Map.entry("school", "Education"), Map.entry("university", "Education"), Map.entry("course", "Education"),
        Map.entry("rent", "Housing"), Map.entry("mortgage", "Housing")
    );

    private static final Map<String, String> INCOME_RULES = Map.ofEntries(
        Map.entry("salary", "Salary"), Map.entry("paycheck", "Salary"), Map.entry("wage", "Salary"),
        Map.entry("freelance", "Freelance"), Map.entry("invoice", "Freelance"),
        Map.entry("dividend", "Investment"), Map.entry("interest", "Investment"), Map.entry("stock", "Investment"),
        Map.entry("gift", "Gift"), Map.entry("bonus", "Gift")
    );

    public String suggestCategory(String description, TransactionType type) {
        if (description == null) return null;
        String lower = description.toLowerCase();
        Map<String, String> rules = type == TransactionType.EXPENSE ? EXPENSE_RULES : INCOME_RULES;
        return rules.entrySet().stream()
            .filter(e -> lower.contains(e.getKey()))
            .map(Map.Entry::getValue)
            .findFirst().orElse(null);
    }
}
