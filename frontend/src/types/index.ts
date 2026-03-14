export interface User {
  userId: string;
  email: string;
  username: string;
  fullName?: string;
  currency: string;
  token: string;
  verified?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'CARD' | 'CASH' | 'BANK_ACCOUNT' | 'SAVINGS';
  currency: string;
  balance: number;
  color: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  accountId: string;
  accountName: string;
  categoryId?: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
}

export interface Transfer {
  id: string;
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  exchangeRate: number;
  convertedAmount: number;
  description: string;
  date: string;
}

export interface Debt {
  id: string;
  type: 'DEBT' | 'RECEIVABLE';
  personName: string;
  amount: number;
  description: string;
  dueDate?: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export interface Budget {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  budgeted: number;
  actual: number;
  remaining: number;
  percentage: number;
  categoryId?: string;
  categoryName?: string;
  categoryIcon?: string;
}

export interface DashboardData {
  monthlyIncome: number;
  monthlyExpense: number;
  netSavings: number;
  categorySpending: { category: string; amount: number }[];
  monthlyTrend: {
    income: { month: number; amount: number }[];
    expense: { month: number; amount: number }[];
  };
}
