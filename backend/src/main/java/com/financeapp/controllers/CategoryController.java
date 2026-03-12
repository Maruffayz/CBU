package com.financeapp.controllers;

import com.financeapp.entities.*;
import com.financeapp.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryRepository.findByUserOrDefault(user));
    }
}
