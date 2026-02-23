package com.example.finance.service;

import com.example.finance.dto.TransferDto;
import com.example.finance.exception.BadRequestException;
import com.example.finance.exception.NotFoundException;
import com.example.finance.model.Account;
import com.example.finance.model.Transfer;
import com.example.finance.repository.AccountRepository;
import com.example.finance.repository.TransferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransferService {

    private final TransferRepository transferRepository;
    private final AccountRepository accountRepository;

    public TransferService(TransferRepository transferRepository, AccountRepository accountRepository) {
        this.transferRepository = transferRepository;
        this.accountRepository = accountRepository;
    }

    public List<TransferDto> getAll() {
        return transferRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TransferDto getById(Long id) {
        return toDto(getEntity(id));
    }

    public TransferDto create(TransferDto dto) {
        if (dto.getExchangeRate() == null || dto.getExchangeRate().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Exchange rate must be positive");
        }
        Account from = accountRepository.findById(dto.getFromAccountId())
                .orElseThrow(() -> new NotFoundException("From account not found"));
        Account to = accountRepository.findById(dto.getToAccountId())
                .orElseThrow(() -> new NotFoundException("To account not found"));

        Transfer transfer = new Transfer();
        transfer.setFromAccount(from);
        transfer.setToAccount(to);
        transfer.setAmount(dto.getAmount());
        transfer.setExchangeRate(dto.getExchangeRate());
        transfer.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());

        // movement
        from.setBalance(from.getBalance().subtract(transfer.getAmount()));
        BigDecimal credited = transfer.getAmount().multiply(transfer.getExchangeRate());
        to.setBalance(to.getBalance().add(credited));

        accountRepository.save(from);
        accountRepository.save(to);

        return toDto(transferRepository.save(transfer));
    }

    public void delete(Long id) {
        Transfer transfer = getEntity(id);
        Account from = transfer.getFromAccount();
        Account to = transfer.getToAccount();

        // revert transfer
        from.setBalance(from.getBalance().add(transfer.getAmount()));
        BigDecimal credited = transfer.getAmount().multiply(transfer.getExchangeRate());
        to.setBalance(to.getBalance().subtract(credited));

        accountRepository.save(from);
        accountRepository.save(to);

        transferRepository.delete(transfer);
    }

    private Transfer getEntity(Long id) {
        return transferRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transfer not found"));
    }

    private TransferDto toDto(Transfer transfer) {
        TransferDto dto = new TransferDto();
        dto.setId(transfer.getId());
        dto.setFromAccountId(transfer.getFromAccount() != null ? transfer.getFromAccount().getId() : null);
        dto.setToAccountId(transfer.getToAccount() != null ? transfer.getToAccount().getId() : null);
        dto.setAmount(transfer.getAmount());
        dto.setExchangeRate(transfer.getExchangeRate());
        dto.setDate(transfer.getDate());
        return dto;
    }
}
