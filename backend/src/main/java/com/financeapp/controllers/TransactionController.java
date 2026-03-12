package com.financeapp.controllers;

import com.financeapp.dto.request.TransactionRequest;
import com.financeapp.dto.response.TransactionResponse;
import com.financeapp.entities.User;
import com.financeapp.enums.TransactionType;
import com.financeapp.services.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.getTransactions(user));
    }

    @PostMapping("/income")
    public ResponseEntity<TransactionResponse> addIncome(@AuthenticationPrincipal User user, @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(transactionService.createTransaction(user, req, TransactionType.INCOME));
    }

    @PostMapping("/expense")
    public ResponseEntity<TransactionResponse> addExpense(@AuthenticationPrincipal User user, @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(transactionService.createTransaction(user, req, TransactionType.EXPENSE));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(@AuthenticationPrincipal User user, @PathVariable UUID id, @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(transactionService.updateTransaction(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        transactionService.deleteTransaction(user, id);
        return ResponseEntity.noContent().build();
    }
}
