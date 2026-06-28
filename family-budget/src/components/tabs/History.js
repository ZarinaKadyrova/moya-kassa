// src/components/tabs/History.js
import { useState } from 'react';
import MonthNav from '../MonthNav';
import TxItem from '../TxItem';

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'expense', label: 'Расходы' },
  { key: 'income', label: 'Доходы' },
  { key: 'Зарина', label: 'Зарина' },
  { key: 'Адлет', label: 'Адлет' },
];

export default function History({ txns, customCats, month, year, onMonthChange, onDelete }) {
  const [filter, setFilter] = useState('all');

  const monthTxns = txns.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const filtered = monthTxns.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'expense' || filter === 'income') return t.type === filter;
    return t.person === filter;
  });

  return (
    <>
      <MonthNav month={month} year={year} onChange={onMonthChange} />
      <div className="filters">
        {FILTERS.map(f => (
          <button key={f.key} className={`filter-pill ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="card">
        {filtered.length === 0
          ? <div className="empty">Нет записей</div>
          : filtered.map(tx => <TxItem key={tx.id} tx={tx} customCats={customCats} onDelete={onDelete} />)
        }
      </div>
    </>
  );
}
