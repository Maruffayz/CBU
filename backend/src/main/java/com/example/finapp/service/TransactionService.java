package com.example.finapp.service;

import com.example.finapp.entity.Account;
import com.example.finapp.entity.Transaction;
import com.example.finapp.entity.TransactionType;
import com.example.finapp.repository.AccountRepository;
import com.example.finapp.repository.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public Transaction createIncomeExpense(Long accountId,
                                           BigDecimal amount,
                                           TransactionType type,
                                           String category,
                                           String description,
                                           LocalDateTime date) {

        if (type != TransactionType.INCOME && type != TransactionType.EXPENSE) {
            throw new IllegalArgumentException("Use transfer() for TRANSFER transactions");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        if (date == null) {
            date = LocalDateTime.now();
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        // Update balance
        if (type == TransactionType.INCOME) {
            account.setBalance(account.getBalance().add(amount));
        } else { // EXPENSE
            account.setBalance(account.getBalance().subtract(amount));
        }

        accountRepository.save(account);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setDate(date);
        tx.setDescription(description);
        tx.setType(type);
        tx.setCategory(category);
        tx.setSourceAccount(account);

        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction transfer(Long fromAccountId,
                                Long toAccountId,
                                BigDecimal amount,
                                BigDecimal exchangeRate,
                                String category,
                                String description,
                                LocalDateTime date) {

        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new EntityNotFoundException("Source account not found"));
        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new EntityNotFoundException("Target account not found"));

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        if (exchangeRate == null) {
            exchangeRate = BigDecimal.ONE;
        }
        if (date == null) {
            date = LocalDateTime.now();
        }

        BigDecimal targetAmount = amount.multiply(exchangeRate);

        // Update balances
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(targetAmount));

        accountRepository.save(from);
        accountRepository.save(to);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setExchangeRate(exchangeRate);
        tx.setDate(date);
        tx.setDescription(description);
        tx.setType(TransactionType.TRANSFER);
        tx.setCategory(category);
        tx.setSourceAccount(from);
        tx.setTargetAccount(to);

        return transactionRepository.save(tx);
    }
}
