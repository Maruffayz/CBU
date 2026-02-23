package com.example.finance.controller;

import com.example.finance.dto.TransferDto;
import com.example.finance.service.TransferService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @GetMapping
    public List<TransferDto> getAll() {
        return transferService.getAll();
    }

    @GetMapping("/{id}")
    public TransferDto getById(@PathVariable Long id) {
        return transferService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransferDto create(@RequestBody TransferDto dto) {
        return transferService.create(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        transferService.delete(id);
    }
}
