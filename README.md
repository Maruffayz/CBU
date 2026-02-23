# Personal Finance Management MVP

## Structure

- backend/ — Java 17 Spring Boot REST API (PostgreSQL)
- frontend/ — React (Vite) SPA client

## Backend setup

1. Ensure PostgreSQL is running and create database:

   - DB name: `finance_db`
   - User: `postgres`
   - Password: `postgres`

   Adjust connection in `backend/src/main/resources/application.properties` if needed.

2. From `backend` folder:

   ```bash
   mvn spring-boot:run
   ```

   API base URL: `http://localhost:8080/api`

## Frontend setup

From `frontend` folder:

```bash
npm install
npm run dev
```

Frontend dev URL: `http://localhost:5173`

## Main API endpoints

- /api/users
- /api/accounts
- /api/expenses
- /api/incomes
- /api/transfers
- /api/debts
- /api/budgets
- /api/statistics/summary

Initial demo data is loaded automatically on first backend start.
