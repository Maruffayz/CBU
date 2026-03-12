package com.financeapp.services;

import com.financeapp.dto.request.DebtRequest;
import com.financeapp.entities.*;
import com.financeapp.enums.DebtStatus;
import com.financeapp.exception.ResourceNotFoundException;
import com.financeapp.repositories.DebtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DebtService {
    private final DebtRepository debtRepository;

    public List<Debt> getDebts(User user) {
        return debtRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Debt createDebt(User user, DebtRequest req) {
        Debt debt = Debt.builder()
            .user(user).type(req.getType()).personName(req.getPersonName())
            .amount(req.getAmount()).description(req.getDescription())
            .dueDate(req.getDueDate()).status(DebtStatus.OPEN).build();
        return debtRepository.save(debt);
    }

    @Transactional
    public Debt updateDebt(User user, UUID id, DebtRequest req) {
        Debt debt = debtRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Debt not found"));
        debt.setPersonName(req.getPersonName());
        debt.setAmount(req.getAmount());
        debt.setDescription(req.getDescription());
        debt.setDueDate(req.getDueDate());
        return debtRepository.save(debt);
    }

    @Transactional
    public Debt closeDebt(User user, UUID id) {
        Debt debt = debtRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Debt not found"));
        debt.setStatus(DebtStatus.CLOSED);
        return debtRepository.save(debt);
    }

    @Transactional
    public void deleteDebt(User user, UUID id) {
        Debt debt = debtRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Debt not found"));
        debtRepository.delete(debt);
    }
}
