package com.example.finance.controller;

import com.example.finance.dto.ExpenseDto;
import com.example.finance.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseDto> getAll() {
        return expenseService.getAll();
    }

    @GetMapping("/{id}")
    public ExpenseDto getById(@PathVariable Long id) {
        return expenseService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseDto create(@RequestBody ExpenseDto dto) {
        return expenseService.create(dto);
    }

    @PutMapping("/{id}")
    public ExpenseDto update(@PathVariable Long id, @RequestBody ExpenseDto dto) {
        return expenseService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        expenseService.delete(id);
    }
}
