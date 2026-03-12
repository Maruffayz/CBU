package com.financeapp.services;

import com.financeapp.dto.request.TransferRequest;
import com.financeapp.entities.*;
import com.financeapp.exception.ResourceNotFoundException;
import com.financeapp.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransferService {
    private final TransferRepository transferRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Transfer createTransfer(User user, TransferRequest req) {
        if (req.getFromAccountId().equals(req.getToAccountId()))
            throw new IllegalArgumentException("Cannot transfer to same account");

        Account from = accountRepository.findByIdAndUser(req.getFromAccountId(), user)
            .orElseThrow(() -> new ResourceNotFoundException("Source account not found"));
        Account to = accountRepository.findByIdAndUser(req.getToAccountId(), user)
            .orElseThrow(() -> new ResourceNotFoundException("Destination account not found"));

        if (from.getBalance().compareTo(req.getAmount()) < 0)
            throw new IllegalArgumentException("Insufficient balance");

        java.math.BigDecimal rate = req.getExchangeRate() != null ? req.getExchangeRate() : java.math.BigDecimal.ONE;
        java.math.BigDecimal converted = req.getAmount().multiply(rate);

        from.setBalance(from.getBalance().subtract(req.getAmount()));
        to.setBalance(to.getBalance().add(converted));
        accountRepository.save(from);
        accountRepository.save(to);

        Transfer transfer = Transfer.builder()
            .user(user).fromAccount(from).toAccount(to)
            .amount(req.getAmount()).exchangeRate(rate).convertedAmount(converted)
            .description(req.getDescription()).build();
        return transferRepository.save(transfer);
    }

    public java.util.List<Transfer> getTransfers(User user) {
        return transferRepository.findByUserOrderByDateDesc(user);
    }
}
