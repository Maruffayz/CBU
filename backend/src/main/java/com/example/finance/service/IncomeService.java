package com.example.finance.service;

import com.example.finance.dto.IncomeDto;
import com.example.finance.exception.NotFoundException;
import com.example.finance.model.Account;
import com.example.finance.model.Income;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final AccountRepository accountRepository;

    public IncomeService(IncomeRepository incomeRepository, AccountRepository accountRepository) {
        this.incomeRepository = incomeRepository;
        this.accountRepository = accountRepository;
    }

    public List<IncomeDto> getAll() {
        return incomeRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public IncomeDto getById(Long id) {
        return toDto(getEntity(id));
    }

    public IncomeDto create(IncomeDto dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        Income income = new Income();
        income.setAmount(dto.getAmount());
        income.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        income.setSource(dto.getSource());
        income.setCategory(dto.getCategory());
        income.setAccount(account);

        Income saved = incomeRepository.save(income);
        account.setBalance(account.getBalance().add(income.getAmount()));
        accountRepository.save(account);

        return toDto(saved);
    }

    public IncomeDto update(Long id, IncomeDto dto) {
        Income existing = getEntity(id);
        Account account = existing.getAccount();

        // revert
        account.setBalance(account.getBalance().subtract(existing.getAmount()));

        existing.setAmount(dto.getAmount());
        existing.setDate(dto.getDate());
        existing.setSource(dto.getSource());
        existing.setCategory(dto.getCategory());

        // apply new
        account.setBalance(account.getBalance().add(existing.getAmount()));
        accountRepository.save(account);

        return toDto(incomeRepository.save(existing));
    }

    public void delete(Long id) {
        Income existing = getEntity(id);
        Account account = existing.getAccount();
        account.setBalance(account.getBalance().subtract(existing.getAmount()));
        accountRepository.save(account);
        incomeRepository.delete(existing);
    }

    public List<Income> getByDateRange(LocalDate start, LocalDate end) {
        return incomeRepository.findByDateBetween(start, end);
    }

    private Income getEntity(Long id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Income not found"));
    }

    private IncomeDto toDto(Income income) {
        IncomeDto dto = new IncomeDto();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setDate(income.getDate());
        dto.setSource(income.getSource());
        dto.setCategory(income.getCategory());
        dto.setAccountId(income.getAccount() != null ? income.getAccount().getId() : null);
        return dto;
    }
}
