package com.financeapp.services;

import com.financeapp.dto.request.AccountRequest;
import com.financeapp.dto.response.AccountResponse;
import com.financeapp.entities.*;
import com.financeapp.exception.ResourceNotFoundException;
import com.financeapp.repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public List<AccountResponse> getAccounts(User user) {
        return accountRepository.findByUserAndActiveTrue(user).stream().map(this::toResponse).toList();
    }

    @Transactional
    public AccountResponse createAccount(User user, AccountRequest request) {
        Account account = Account.builder()
            .user(user).name(request.getName()).type(request.getType())
            .currency(request.getCurrency()).balance(request.getBalance())
            .color(request.getColor()).build();
        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public AccountResponse updateAccount(User user, UUID id, AccountRequest request) {
        Account account = accountRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        account.setName(request.getName());
        account.setType(request.getType());
        account.setCurrency(request.getCurrency());
        account.setColor(request.getColor());
        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public void deleteAccount(User user, UUID id) {
        Account account = accountRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        account.setActive(false);
        accountRepository.save(account);
    }

    public AccountResponse toResponse(Account a) {
        AccountResponse r = new AccountResponse();
        r.setId(a.getId()); r.setName(a.getName()); r.setType(a.getType());
        r.setCurrency(a.getCurrency()); r.setBalance(a.getBalance());
        r.setColor(a.getColor()); r.setActive(a.isActive());
        return r;
    }
}
