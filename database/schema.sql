-- ============================================================
-- Personal Finance Manager - PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    username    VARCHAR(100) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    currency    VARCHAR(10) DEFAULT 'USD',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

-- ACCOUNTS
CREATE TABLE accounts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(20) NOT NULL CHECK (type IN ('CARD','CASH','BANK_ACCOUNT','SAVINGS')),
    currency    VARCHAR(10) DEFAULT 'USD',
    balance     DECIMAL(15,2) DEFAULT 0.00,
    color       VARCHAR(7) DEFAULT '#6366f1',
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_accounts_user ON accounts(user_id);

-- CATEGORIES
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(10) NOT NULL CHECK (type IN ('INCOME','EXPENSE')),
    icon        VARCHAR(50) DEFAULT '💰',
    color       VARCHAR(7) DEFAULT '#6366f1',
    is_default  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_categories_user ON categories(user_id);

-- TRANSACTIONS
CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    category_id     UUID REFERENCES categories(id),
    type            VARCHAR(10) NOT NULL CHECK (type IN ('INCOME','EXPENSE')),
    amount          DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    description     VARCHAR(500),
    date            DATE NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);

-- TRANSFERS
CREATE TABLE transfers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_account_id     UUID NOT NULL REFERENCES accounts(id),
    to_account_id       UUID NOT NULL REFERENCES accounts(id),
    amount              DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    exchange_rate       DECIMAL(10,6) DEFAULT 1.0,
    converted_amount    DECIMAL(15,2),
    description         VARCHAR(500),
    date                TIMESTAMP DEFAULT NOW(),
    created_at          TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_transfers_user ON transfers(user_id);

-- DEBTS
CREATE TABLE debts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(15) NOT NULL CHECK (type IN ('DEBT','RECEIVABLE')),
    person_name VARCHAR(100) NOT NULL,
    amount      DECIMAL(15,2) NOT NULL,
    description VARCHAR(500),
    due_date    DATE,
    status      VARCHAR(10) DEFAULT 'OPEN' CHECK (status IN ('OPEN','CLOSED')),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_debts_user ON debts(user_id);

-- BUDGETS
CREATE TABLE budgets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    type        VARCHAR(10) NOT NULL CHECK (type IN ('INCOME','EXPENSE')),
    amount      DECIMAL(15,2) NOT NULL,
    month       INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year        INT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, category_id, month, year)
);
CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_period ON budgets(year, month);
