package com.example.finance.controller;

import com.example.finance.dto.IncomeDto;
import com.example.finance.service.IncomeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public List<IncomeDto> getAll() {
        return incomeService.getAll();
    }

    @GetMapping("/{id}")
    public IncomeDto getById(@PathVariable Long id) {
        return incomeService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncomeDto create(@RequestBody IncomeDto dto) {
        return incomeService.create(dto);
    }

    @PutMapping("/{id}")
    public IncomeDto update(@PathVariable Long id, @RequestBody IncomeDto dto) {
        return incomeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        incomeService.delete(id);
    }
}
