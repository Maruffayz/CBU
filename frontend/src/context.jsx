import React, { createContext, useContext, useReducer } from 'react';

const FinanceStateContext = createContext(null);
const FinanceDispatchContext = createContext(null);

const initialState = {
  accounts: {
    total: 0,
    cash: 0,
    cards: 0,
  },
  transactions: [],
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const { transaction } = action.payload;
      const sign = transaction.type === 'income' ? 1 : -1;

      const updatedAccounts = {
        ...state.accounts,
        [transaction.account]: (state.accounts[transaction.account] || 0) + sign * transaction.amount,
      };

      const total = Object.values(updatedAccounts).reduce((sum, v) => sum + v, 0);

      return {
        ...state,
        accounts: {
          ...updatedAccounts,
          total,
        },
        transactions: [transaction, ...state.transactions],
      };
    }
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  return (
    <FinanceStateContext.Provider value={state}>
      <FinanceDispatchContext.Provider value={dispatch}>
        {children}
      </FinanceDispatchContext.Provider>
    </FinanceStateContext.Provider>
  );
}

export function useFinanceState() {
  const ctx = useContext(FinanceStateContext);
  if (!ctx) throw new Error('useFinanceState must be used within FinanceProvider');
  return ctx;
}

export function useFinanceDispatch() {
  const ctx = useContext(FinanceDispatchContext);
  if (!ctx) throw new Error('useFinanceDispatch must be used within FinanceProvider');
  return ctx;
}
