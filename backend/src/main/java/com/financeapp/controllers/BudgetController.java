package com.financeapp.controllers;

import com.financeapp.dto.request.BudgetRequest;
import com.financeapp.entities.*;
import com.financeapp.services.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Map<String,Object>>> get(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "0") int month,
        @RequestParam(defaultValue = "0") int year) {
        if (month == 0) month = LocalDate.now().getMonthValue();
        if (year == 0) year = LocalDate.now().getYear();
        return ResponseEntity.ok(budgetService.getBudgetsWithProgress(user, month, year));
    }

    @PostMapping
    public ResponseEntity<Budget> create(@AuthenticationPrincipal User user, @Valid @RequestBody BudgetRequest req) {
        return ResponseEntity.ok(budgetService.createBudget(user, req));
    }
}
