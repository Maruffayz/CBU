package com.example.finance.service;

import com.example.finance.dto.AccountDto;
import com.example.finance.exception.NotFoundException;
import com.example.finance.model.Account;
import com.example.finance.model.User;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public List<AccountDto> getAll() {
        return accountRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public AccountDto getById(Long id) {
        return toDto(getEntity(id));
    }

    public AccountDto create(AccountDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Account account = new Account();
        account.setName(dto.getName());
        account.setType(dto.getType());
        account.setCurrency(dto.getCurrency());
        account.setBalance(dto.getBalance() != null ? dto.getBalance() : BigDecimal.ZERO);
        account.setUser(user);
        return toDto(accountRepository.save(account));
    }

    public AccountDto update(Long id, AccountDto dto) {
        Account account = getEntity(id);
        account.setName(dto.getName());
        account.setType(dto.getType());
        account.setCurrency(dto.getCurrency());
        if (dto.getBalance() != null) {
            account.setBalance(dto.getBalance());
        }
        return toDto(accountRepository.save(account));
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    public Account getEntity(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }

    public void increaseBalance(Account account, BigDecimal amount) {
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
    }

    public void decreaseBalance(Account account, BigDecimal amount) {
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);
    }

    private AccountDto toDto(Account account) {
        AccountDto dto = new AccountDto();
        dto.setId(account.getId());
        dto.setName(account.getName());
        dto.setType(account.getType());
        dto.setCurrency(account.getCurrency());
        dto.setBalance(account.getBalance());
        dto.setUserId(account.getUser() != null ? account.getUser().getId() : null);
        return dto;
    }
}
