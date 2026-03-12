package com.financeapp.services;

import com.financeapp.dto.request.TransactionRequest;
import com.financeapp.dto.response.TransactionResponse;
import com.financeapp.entities.*;
import com.financeapp.enums.TransactionType;
import com.financeapp.exception.ResourceNotFoundException;
import com.financeapp.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final AutoCategorizationService autoCategorizationService;

    public List<TransactionResponse> getTransactions(User user) {
        return transactionRepository.findByUserOrderByDateDesc(user).stream().map(this::toResponse).toList();
    }

    @Transactional
    public TransactionResponse createTransaction(User user, TransactionRequest req, TransactionType type) {
        Account account = accountRepository.findByIdAndUser(req.getAccountId(), user)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Category category = null;
        if (req.getCategoryId() != null) {
            category = categoryRepository.findById(req.getCategoryId()).orElse(null);
        }
        // Auto-categorize if no category provided
        if (category == null && req.getDescription() != null) {
            String suggested = autoCategorizationService.suggestCategory(req.getDescription(), type);
            if (suggested != null) {
                List<Category> cats = categoryRepository.findByUserOrDefaultAndType(user, type);
                category = cats.stream().filter(c -> c.getName().equalsIgnoreCase(suggested)).findFirst().orElse(null);
            }
        }

        Transaction transaction = Transaction.builder()
            .user(user).account(account).category(category)
            .type(type).amount(req.getAmount())
            .description(req.getDescription()).date(req.getDate())
            .build();

        // Update balance
        if (type == TransactionType.INCOME) {
            account.setBalance(account.getBalance().add(req.getAmount()));
        } else {
            account.setBalance(account.getBalance().subtract(req.getAmount()));
        }
        accountRepository.save(account);
        return toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse updateTransaction(User user, UUID id, TransactionRequest req) {
        Transaction tx = transactionRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Reverse old balance effect
        Account account = tx.getAccount();
        if (tx.getType() == TransactionType.INCOME) {
            account.setBalance(account.getBalance().subtract(tx.getAmount()));
        } else {
            account.setBalance(account.getBalance().add(tx.getAmount()));
        }

        // Apply new
        Account newAccount = accountRepository.findByIdAndUser(req.getAccountId(), user)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (tx.getType() == TransactionType.INCOME) {
            newAccount.setBalance(newAccount.getBalance().add(req.getAmount()));
        } else {
            newAccount.setBalance(newAccount.getBalance().subtract(req.getAmount()));
        }
        accountRepository.save(account);
        accountRepository.save(newAccount);

        tx.setAccount(newAccount);
        tx.setAmount(req.getAmount());
        tx.setDescription(req.getDescription());
        tx.setDate(req.getDate());
        return toResponse(transactionRepository.save(tx));
    }

    @Transactional
    public void deleteTransaction(User user, UUID id) {
        Transaction tx = transactionRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        // Reverse balance
        Account account = tx.getAccount();
        if (tx.getType() == TransactionType.INCOME) {
            account.setBalance(account.getBalance().subtract(tx.getAmount()));
        } else {
            account.setBalance(account.getBalance().add(tx.getAmount()));
        }
        accountRepository.save(account);
        transactionRepository.delete(tx);
    }

    public TransactionResponse toResponse(Transaction t) {
        TransactionResponse r = new TransactionResponse();
        r.setId(t.getId()); r.setType(t.getType()); r.setAmount(t.getAmount());
        r.setDescription(t.getDescription()); r.setDate(t.getDate());
        r.setAccountId(t.getAccount().getId()); r.setAccountName(t.getAccount().getName());
        if (t.getCategory() != null) {
            r.setCategoryId(t.getCategory().getId()); r.setCategoryName(t.getCategory().getName());
            r.setCategoryIcon(t.getCategory().getIcon()); r.setCategoryColor(t.getCategory().getColor());
        }
        return r;
    }
}
