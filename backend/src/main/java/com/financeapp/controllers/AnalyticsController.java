package com.financeapp.controllers;

import com.financeapp.entities.User;
import com.financeapp.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String,Object>> dashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getDashboard(user));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<Map<String,List<Map<String,Object>>>> monthlyTrend(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "0") int year) {
        if (year == 0) year = LocalDate.now().getYear();
        return ResponseEntity.ok(analyticsService.getMonthlyTrend(user, year));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<Map<String,Object>>> calendar(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "0") int month,
        @RequestParam(defaultValue = "0") int year) {
        if (month == 0) month = LocalDate.now().getMonthValue();
        if (year == 0) year = LocalDate.now().getYear();
        return ResponseEntity.ok(analyticsService.getCalendarData(user, year, month));
    }
}
