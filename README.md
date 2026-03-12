# 💰 FinanceAI — Personal Finance Manager

A full-stack MVP Personal Finance Management application built with Spring Boot + Next.js.

## ✨ Features

- **🔐 Authentication** — JWT-based register/login
- **💳 Accounts** — Cards, cash, bank accounts, savings wallets
- **📊 Transactions** — Income & expense tracking with auto-categorization
- **🔄 Transfers** — Move money between accounts with exchange rate support
- **📑 Debts & Receivables** — Track money you owe and are owed
- **🎯 Budgets** — Set monthly limits by category, track actuals
- **📈 Analytics** — Income vs expense charts, category breakdown, trends
- **📅 Calendar** — Daily income/expense view
- **🤖 Auto-categorization** — Rule-based category detection from description

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database | PostgreSQL 16, JPA/Hibernate |
| Frontend | Next.js 14, React 18, TypeScript |
| UI | TailwindCSS, Recharts |
| DevOps | Docker, Docker Compose |

---

## 🛠️ Quick Start (Docker)

```bash
git clone https://github.com/your-username/finance-app
cd finance-app/docker
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

---

## 🛠️ Local Development

### Prerequisites
- Java 17+
- Node.js 20+
- PostgreSQL 16+
- Maven 3.9+

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE financedb;"

# Run schema
psql -U postgres -d financedb -f database/schema.sql

# Seed default categories
psql -U postgres -d financedb -f database/seed.sql
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Or with custom settings:
```bash
DB_USERNAME=postgres DB_PASSWORD=yourpassword mvn spring-boot:run
```

Backend runs on: http://localhost:8080/api

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

---

## 📁 Project Structure

```
finance-app/
├── backend/
│   ├── src/main/java/com/financeapp/
│   │   ├── controllers/          # REST controllers
│   │   │   ├── AuthController
│   │   │   ├── AccountController
│   │   │   ├── TransactionController
│   │   │   ├── TransferController
│   │   │   ├── DebtController
│   │   │   ├── BudgetController
│   │   │   └── AnalyticsController
│   │   ├── services/             # Business logic
│   │   │   ├── AuthService
│   │   │   ├── AccountService
│   │   │   ├── TransactionService
│   │   │   ├── TransferService
│   │   │   ├── DebtService
│   │   │   ├── BudgetService
│   │   │   ├── AnalyticsService
│   │   │   └── AutoCategorizationService
│   │   ├── repositories/         # JPA data access
│   │   ├── entities/             # JPA entities
│   │   ├── dto/                  # Request/Response DTOs
│   │   ├── security/             # JWT filter & service
│   │   ├── config/               # Spring configs
│   │   ├── enums/                # Enumerations
│   │   └── exception/            # Global error handling
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   └── src/
│       ├── app/                  # Next.js App Router pages
│       │   ├── login/
│       │   ├── register/
│       │   ├── dashboard/
│       │   ├── accounts/
│       │   ├── transactions/
│       │   ├── transfers/
│       │   ├── debts/
│       │   ├── budgets/
│       │   ├── analytics/
│       │   └── calendar/
│       ├── components/
│       │   └── common/           # Shared UI components
│       ├── services/             # API client
│       ├── context/              # Auth context
│       └── types/                # TypeScript types
│
├── database/
│   ├── schema.sql                # PostgreSQL schema
│   └── seed.sql                  # Default categories
│
├── docker/
│   └── docker-compose.yml
│
└── README.md
```

---

## 🔌 API Reference

### Authentication
```
POST /api/auth/register  { email, username, password, currency }
POST /api/auth/login     { email, password }
```

### Accounts
```
GET    /api/accounts
POST   /api/accounts     { name, type, currency, balance, color }
PUT    /api/accounts/:id
DELETE /api/accounts/:id
```

### Transactions
```
GET    /api/transactions
POST   /api/transactions/income   { amount, date, description, categoryId, accountId }
POST   /api/transactions/expense  { amount, date, description, categoryId, accountId }
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Transfers
```
GET  /api/transfers
POST /api/transfers  { fromAccountId, toAccountId, amount, exchangeRate, description }
```

### Debts
```
GET    /api/debts
POST   /api/debts       { type, personName, amount, description, dueDate }
PUT    /api/debts/:id
PATCH  /api/debts/:id/close
DELETE /api/debts/:id
```

### Budgets
```
GET  /api/budgets?month=3&year=2025
POST /api/budgets  { type, categoryId, amount, month, year }
```

### Analytics
```
GET /api/analytics/dashboard
GET /api/analytics/monthly-trend?year=2025
GET /api/analytics/calendar?month=3&year=2025
```

---

## 🤖 Auto-Categorization

The system automatically detects categories from transaction descriptions:

| Keywords | Category |
|----------|----------|
| taxi, uber, lyft, bus | Transport |
| electricity, water, internet | Utilities |
| grocery, restaurant, coffee | Food & Dining |
| netflix, spotify, movie | Entertainment |
| hospital, pharmacy | Healthcare |
| salary, paycheck | Salary |
| freelance, invoice | Freelance |

---

## 🔐 Environment Variables

### Backend
```env
DB_USERNAME=postgres
DB_PASSWORD=password
JWT_SECRET=your-256-bit-secret-key
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📄 License
MIT License
