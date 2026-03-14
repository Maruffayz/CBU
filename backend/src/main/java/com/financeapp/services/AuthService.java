package com.financeapp.services;

import com.financeapp.dto.request.*;
import com.financeapp.dto.response.AuthResponse;
import com.financeapp.entities.Account;
import com.financeapp.entities.User;
import com.financeapp.enums.AccountType;
import com.financeapp.repositories.AccountRepository;
import com.financeapp.repositories.UserRepository;
import com.financeapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final JavaMailSender mailSender;

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
        // generate verification code valid for 15 minutes
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        user.setEmailVerified(false);
        user.setVerificationCode(code);
        user.setVerificationExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Create a default primary account for the new user so they can
        // immediately add income/expenses without manually creating accounts.
        Account defaultAccount = Account.builder()
            .user(user)
            .name("Main Account")
            .type(AccountType.CASH)
            .currency(user.getCurrency())
            .balance(BigDecimal.ZERO)
            .build();
        accountRepository.save(defaultAccount);

        sendVerificationEmail(user, code);

        // Registration succeeds but user must verify email before login.
        return AuthResponse.builder()
            .token(null)
            .type("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .username(user.getDisplayName())
            .currency(user.getCurrency())
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        // Backward compatibility: users created before email verification was
        // introduced don't have a code/expiry set. Treat them as verified.
        if (!user.isEmailVerified()) {
            if (user.getVerificationCode() == null && user.getVerificationExpiresAt() == null) {
                user.setEmailVerified(true);
                userRepository.save(user);
            } else {
                throw new IllegalStateException("Email not verified");
            }
        }
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
            .token(token).type("Bearer")
            .userId(user.getId()).email(user.getEmail())
            .username(user.getDisplayName()).currency(user.getCurrency())
            .build();
    }

    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() ->
            new IllegalArgumentException("User not found"));

        if (user.isEmailVerified()) {
            String token = jwtService.generateToken(user);
            return AuthResponse.builder()
                .token(token).type("Bearer")
                .userId(user.getId()).email(user.getEmail())
                .username(user.getDisplayName()).currency(user.getCurrency())
                .build();
        }

        if (user.getVerificationCode() == null || user.getVerificationExpiresAt() == null
            || user.getVerificationExpiresAt().isBefore(LocalDateTime.now())
            || !user.getVerificationCode().equals(request.getCode())) {
            throw new IllegalArgumentException("Invalid or expired verification code");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationExpiresAt(null);
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
            .token(token).type("Bearer")
            .userId(user.getId()).email(user.getEmail())
            .username(user.getDisplayName()).currency(user.getCurrency())
            .build();
    }

    private void sendVerificationEmail(User user, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Verify your Finance app account");
        message.setText("Your verification code is: " + code + "\n\n" +
            "This code is valid for 15 minutes.");
        mailSender.send(message);
    }
}
