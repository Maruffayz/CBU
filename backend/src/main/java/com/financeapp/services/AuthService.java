package com.financeapp.services;

import com.financeapp.dto.request.*;
import com.financeapp.dto.response.AuthResponse;
import com.financeapp.entities.User;
import com.financeapp.repositories.UserRepository;
import com.financeapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
            .email(request.getEmail())
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .currency(request.getCurrency())
            .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
            .token(token).type("Bearer")
            .userId(user.getId()).email(user.getEmail())
            .username(user.getDisplayName()).currency(user.getCurrency())
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
            .token(token).type("Bearer")
            .userId(user.getId()).email(user.getEmail())
            .username(user.getDisplayName()).currency(user.getCurrency())
            .build();
    }
}
