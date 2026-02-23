package com.example.finance.controller;

import com.example.finance.dto.BudgetDto;
import com.example.finance.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public List<BudgetDto> getAll() {
        return budgetService.getAll();
    }

    @GetMapping("/{id}")
    public BudgetDto getById(@PathVariable Long id) {
        return budgetService.getById(id);
    }

    @GetMapping("/month")
    public List<BudgetDto> getForMonth(@RequestParam int year, @RequestParam int month) {
        return budgetService.getForMonth(year, month);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetDto create(@RequestBody BudgetDto dto) {
        return budgetService.create(dto);
    }

    @PutMapping("/{id}")
    public BudgetDto update(@PathVariable Long id, @RequestBody BudgetDto dto) {
        return budgetService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        budgetService.delete(id);
    }
}
