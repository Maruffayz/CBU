import React from 'react';

const typeColors = {
  income: 'text-emerald-500 bg-emerald-500/10',
  expense: 'text-rose-500 bg-rose-500/10',
  transfer: 'text-sky-500 bg-sky-500/10',
};

export default function TransactionItem({ transaction }) {
  const { description, amount, type, category, account, date } = transaction;
  const colorClass = typeColors[type] || 'text-slate-300 bg-slate-500/10';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${colorClass}`}>
          {category?.icon || category?.name?.[0] || type[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-100">{description || category?.name || 'Transaction'}</p>
          <p className="text-xs text-slate-500">{account} • {new Date(date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {type === 'income' ? '+' : type === 'expense' ? '-' : ''}${amount.toFixed(2)}
        </p>
        <p className="text-xs text-slate-500 capitalize">{type}</p>
      </div>
    </div>
  );
}
