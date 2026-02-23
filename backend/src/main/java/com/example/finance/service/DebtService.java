package com.example.finance.service;

import com.example.finance.dto.DebtDto;
import com.example.finance.exception.NotFoundException;
import com.example.finance.model.Debt;
import com.example.finance.repository.DebtRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DebtService {

    private final DebtRepository debtRepository;

    public DebtService(DebtRepository debtRepository) {
        this.debtRepository = debtRepository;
    }

    public List<DebtDto> getAll() {
        return debtRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public DebtDto getById(Long id) {
        return toDto(getEntity(id));
    }

    public DebtDto create(DebtDto dto) {
        Debt debt = new Debt();
        debt.setPersonName(dto.getPersonName());
        debt.setAmount(dto.getAmount());
        debt.setType(dto.getType());
        debt.setStatus(dto.getStatus());
        debt.setDueDate(dto.getDueDate());
        return toDto(debtRepository.save(debt));
    }

    public DebtDto update(Long id, DebtDto dto) {
        Debt debt = getEntity(id);
        debt.setPersonName(dto.getPersonName());
        debt.setAmount(dto.getAmount());
        debt.setType(dto.getType());
        debt.setStatus(dto.getStatus());
        debt.setDueDate(dto.getDueDate());
        return toDto(debtRepository.save(debt));
    }

    public void delete(Long id) {
        debtRepository.deleteById(id);
    }

    private Debt getEntity(Long id) {
        return debtRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Debt not found"));
    }

    private DebtDto toDto(Debt debt) {
        DebtDto dto = new DebtDto();
        dto.setId(debt.getId());
        dto.setPersonName(debt.getPersonName());
        dto.setAmount(debt.getAmount());
        dto.setType(debt.getType());
        dto.setStatus(debt.getStatus());
        dto.setDueDate(debt.getDueDate());
        return dto;
    }
}
