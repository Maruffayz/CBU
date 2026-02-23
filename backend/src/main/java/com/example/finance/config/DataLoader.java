package com.example.finance.config;

import com.example.finance.model.*;
import com.example.finance.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final TransferRepository transferRepository;
    private final DebtRepository debtRepository;
    private final BudgetRepository budgetRepository;

    public DataLoader(UserRepository userRepository,
                      AccountRepository accountRepository,
                      ExpenseRepository expenseRepository,
                      IncomeRepository incomeRepository,
                      TransferRepository transferRepository,
                      DebtRepository debtRepository,
                      BudgetRepository budgetRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.transferRepository = transferRepository;
        this.debtRepository = debtRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User user = new User();
        user.setName("Demo User");
        user.setEmail("demo@example.com");
        user = userRepository.save(user);

        Account cash = new Account();
        cash.setName("Wallet");
        cash.setType(AccountType.CASH);
        cash.setCurrency("USD");
        cash.setBalance(new BigDecimal("500"));
        cash.setUser(user);
        cash = accountRepository.save(cash);

        Account card = new Account();
        card.setName("Main Card");
        card.setType(AccountType.CARD);
        card.setCurrency("USD");
        card.setBalance(new BigDecimal("1500"));
        card.setUser(user);
        card = accountRepository.save(card);

        Income salary = new Income();
        salary.setAccount(card);
        salary.setAmount(new BigDecimal("2000"));
        salary.setDate(LocalDate.now().minusDays(5));
        salary.setSource("Salary");
        salary.setCategory("Salary");
        incomeRepository.save(salary);
        card.setBalance(card.getBalance().add(salary.getAmount()));
        accountRepository.save(card);

        Expense groceries = new Expense();
        groceries.setAccount(cash);
        groceries.setAmount(new BigDecimal("120"));
        groceries.setDate(LocalDate.now().minusDays(2));
        groceries.setDescription("Groceries store");
        groceries.setCategory("Groceries");
        expenseRepository.save(groceries);
        cash.setBalance(cash.getBalance().subtract(groceries.getAmount()));
        accountRepository.save(cash);

        Expense utilities = new Expense();
        utilities.setAccount(card);
        utilities.setAmount(new BigDecimal("80"));
        utilities.setDate(LocalDate.now().minusDays(1));
        utilities.setDescription("Electricity bill");
        utilities.setCategory("Utilities");
        expenseRepository.save(utilities);
        card.setBalance(card.getBalance().subtract(utilities.getAmount()));
        accountRepository.save(card);

        Transfer transfer = new Transfer();
        transfer.setFromAccount(card);
        transfer.setToAccount(cash);
        transfer.setAmount(new BigDecimal("200"));
        transfer.setExchangeRate(BigDecimal.ONE);
        transfer.setDate(LocalDate.now().minusDays(1));
        transferRepository.save(transfer);
        card.setBalance(card.getBalance().subtract(transfer.getAmount()));
        cash.setBalance(cash.getBalance().add(transfer.getAmount()));
        accountRepository.save(card);
        accountRepository.save(cash);

        Debt debt = new Debt();
        debt.setPersonName("Friend John");
        debt.setAmount(new BigDecimal("150"));
        debt.setType(DebtType.GIVEN);
        debt.setStatus(DebtStatus.OPEN);
        debt.setDueDate(LocalDate.now().plusDays(30));
        debtRepository.save(debt);

        Budget budget = new Budget();
        budget.setYear(LocalDate.now().getYear());
        budget.setMonth(LocalDate.now().getMonthValue());
        budget.setCategory("Groceries");
        budget.setLimitAmount(new BigDecimal("300"));
        budgetRepository.save(budget);
    }
}
