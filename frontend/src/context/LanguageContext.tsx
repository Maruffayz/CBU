"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "uz" | "ru";

type Translations = Record<string, string>;

type Dictionary = Record<Language, Translations>;

const translations: Dictionary = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.accounts": "Accounts",
    "nav.transactions": "Transactions",
    "nav.transfers": "Transfers",
    "nav.debts": "Debts",
    "nav.budgets": "Budgets",
    "nav.analytics": "Analytics",
    "nav.calendar": "Calendar",
    "nav.signOut": "Sign Out",

    "auth.appTitle": "FinanceAI",
    "auth.appSubtitle": "Smart Personal Finance Manager",
    "auth.welcomeBack": "Welcome back",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.signIn": "Sign In",
    "auth.signingIn": "Signing in...",
    "auth.noAccount": "No account?",
    "auth.register": "Register",
    "auth.demoCredentials": "Demo: demo@finance.app / password123",

    "lang.english": "English",
    "lang.uzbek": "O'zbekcha",
    "lang.russian": "Русский",
    "lang.label": "Language",
  },
  uz: {
    "nav.dashboard": "Bosh sahifa",
    "nav.accounts": "Hisoblar",
    "nav.transactions": "Tranzaksiyalar",
    "nav.transfers": "O'tkazmalar",
    "nav.debts": "Qarzlar",
    "nav.budgets": "Byudjetlar",
    "nav.analytics": "Tahlil",
    "nav.calendar": "Kalendar",
    "nav.signOut": "Chiqish",

    "auth.appTitle": "FinanceAI",
    "auth.appSubtitle": "Aqlli moliya boshqaruvi",
    "auth.welcomeBack": "Qaytganingizdan xursandmiz",
    "auth.email": "Email",
    "auth.password": "Parol",
    "auth.signIn": "Kirish",
    "auth.signingIn": "Kirilmoqda...",
    "auth.noAccount": "Akkauntingiz yo'qmi?",
    "auth.register": "Ro'yxatdan o'tish",
    "auth.demoCredentials": "Demo: demo@finance.app / password123",

    "lang.english": "English",
    "lang.uzbek": "O'zbekcha",
    "lang.russian": "Русский",
    "lang.label": "Til",
  },
  ru: {
    "nav.dashboard": "Главная",
    "nav.accounts": "Счета",
    "nav.transactions": "Транзакции",
    "nav.transfers": "Переводы",
    "nav.debts": "Долги",
    "nav.budgets": "Бюджеты",
    "nav.analytics": "Аналитика",
    "nav.calendar": "Календарь",
    "nav.signOut": "Выйти",

    "auth.appTitle": "FinanceAI",
    "auth.appSubtitle": "Умный менеджер личных финансов",
    "auth.welcomeBack": "С возвращением",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.signIn": "Войти",
    "auth.signingIn": "Вход...",
    "auth.noAccount": "Нет аккаунта?",
    "auth.register": "Регистрация",
    "auth.demoCredentials": "Демо: demo@finance.app / password123",

    "lang.english": "English",
    "lang.uzbek": "O'zbekcha",
    "lang.russian": "Русский",
    "lang.label": "Язык",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "finance_language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && ["en", "uz", "ru"].includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
