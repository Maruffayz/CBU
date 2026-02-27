import React from 'react';

export default function BalanceCard({ label, amount }) {
  return (
    <div className="flex-1 rounded-2xl bg-slate-900 text-white p-4 shadow-sm border border-slate-800">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold">${amount.toFixed(2)}</p>
    </div>
  );
}
