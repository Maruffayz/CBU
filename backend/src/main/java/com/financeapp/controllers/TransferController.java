package com.financeapp.controllers;

import com.financeapp.dto.request.TransferRequest;
import com.financeapp.entities.*;
import com.financeapp.services.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/transfers")
@RequiredArgsConstructor
public class TransferController {
    private final TransferService transferService;

    @GetMapping
    public ResponseEntity<List<Transfer>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transferService.getTransfers(user));
    }

    @PostMapping
    public ResponseEntity<Transfer> create(@AuthenticationPrincipal User user, @Valid @RequestBody TransferRequest req) {
        return ResponseEntity.ok(transferService.createTransfer(user, req));
    }
}
