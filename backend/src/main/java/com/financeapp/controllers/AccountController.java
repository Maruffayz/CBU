package com.financeapp.controllers;

import com.financeapp.dto.request.AccountRequest;
import com.financeapp.dto.response.AccountResponse;
import com.financeapp.entities.User;
import com.financeapp.services.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.getAccounts(user));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> create(@AuthenticationPrincipal User user, @Valid @RequestBody AccountRequest req) {
        return ResponseEntity.ok(accountService.createAccount(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> update(@AuthenticationPrincipal User user, @PathVariable UUID id, @Valid @RequestBody AccountRequest req) {
        return ResponseEntity.ok(accountService.updateAccount(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        accountService.deleteAccount(user, id);
        return ResponseEntity.noContent().build();
    }
}
