'use client';
import { useEffect, useState } from 'react';
import { analyticsApi } from '@/services/api';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function fmt(n: number) { return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(n); }

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    analyticsApi.calendar(month, year).then(r => setData(r.data));
  }, [month, year]);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const byDate: Record<string, {income: number, expense: number}> = {};
  data.forEach(t => {
    const d = t.date;
    if (!byDate[d]) byDate[d] = { income: 0, expense: 0 };
    if (t.type === 'INCOME') byDate[d].income += Number(t.amount);
    else byDate[d].expense += Number(t.amount);
  });

  const padDate = (d: number) => `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const selectedTxs = selected ? data.filter(t => t.date === selected) : [];

  const prev = () => { if (month === 1) { setMonth(12); setYear(y => y-1); } else setMonth(m => m-1); };
  const next = () => { if (month === 12) { setMonth(1); setYear(y => y+1); } else setMonth(m => m+1); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-slate-400 text-sm">Daily income & expenses</p></div>
        <div className="flex items-center gap-3">
          <button onClick={prev} className="btn-ghost px-3 py-2">‹</button>
          <span className="font-semibold min-w-[140px] text-center">{MONTHS[month-1]} {year}</span>
          <button onClick={next} className="btn-ghost px-3 py-2">›</button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs text-slate-500 py-2 font-medium">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length: firstDay}).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({length: daysInMonth}).map((_, i) => {
            const day = i + 1;
            const dateStr = padDate(day);
            const dayData = byDate[dateStr];
            const isToday = day === now.getDate() && month === now.getMonth()+1 && year === now.getFullYear();
            const isSelected = selected === dateStr;
            return (
              <div key={day} onClick={() => setSelected(isSelected ? null : dateStr)}
                className={`min-h-[72px] p-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isToday ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
                style={{background: isSelected ? 'rgba(79,110,247,0.1)' : undefined}}>
                <div className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>{day}</div>
                {dayData && (
                  <div className="mt-1 space-y-0.5">
                    {dayData.income > 0 && <div className="text-xs text-green-400 font-medium truncate">+{fmt(dayData.income)}</div>}
                    {dayData.expense > 0 && <div className="text-xs text-red-400 font-medium truncate">-{fmt(dayData.expense)}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selected && selectedTxs.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">{selected}</h3>
          <div className="space-y-2">
            {selectedTxs.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{background:'#ffffff08'}}>
                <div className={`font-semibold ${t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}{fmt(t.amount)}
                </div>
                <div className="text-slate-400 text-sm">{t.description || t.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
