package com.financeapp.controllers;

import com.financeapp.dto.request.DebtRequest;
import com.financeapp.entities.*;
import com.financeapp.services.DebtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/debts")
@RequiredArgsConstructor
public class DebtController {
    private final DebtService debtService;

    @GetMapping
    public ResponseEntity<List<Debt>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(debtService.getDebts(user));
    }

    @PostMapping
    public ResponseEntity<Debt> create(@AuthenticationPrincipal User user, @Valid @RequestBody DebtRequest req) {
        return ResponseEntity.ok(debtService.createDebt(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Debt> update(@AuthenticationPrincipal User user, @PathVariable UUID id, @Valid @RequestBody DebtRequest req) {
        return ResponseEntity.ok(debtService.updateDebt(user, id, req));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Debt> close(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        return ResponseEntity.ok(debtService.closeDebt(user, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        debtService.deleteDebt(user, id);
        return ResponseEntity.noContent().build();
    }
}
