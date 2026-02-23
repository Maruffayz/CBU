package com.example.finance.controller;

import com.example.finance.dto.DebtDto;
import com.example.finance.service.DebtService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @GetMapping
    public List<DebtDto> getAll() {
        return debtService.getAll();
    }

    @GetMapping("/{id}")
    public DebtDto getById(@PathVariable Long id) {
        return debtService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DebtDto create(@RequestBody DebtDto dto) {
        return debtService.create(dto);
    }

    @PutMapping("/{id}")
    public DebtDto update(@PathVariable Long id, @RequestBody DebtDto dto) {
        return debtService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        debtService.delete(id);
    }
}
