// src/components/tabs/Categories.js
import MonthNav from '../MonthNav';
import { getCat } from '../../utils/helpers';
import { fmt } from '../../utils/helpers';

export default function Categories({ txns, customCats, month, year, onMonthChange }) {
  const expenses = txns.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === month && d.getFullYear() === year;
  });

  const bycat = {};
  expenses.forEach(t => { bycat[t.category] = (bycat[t.category] || 0) + t.amount; });
  const total = Object.values(bycat).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(bycat).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <MonthNav month={month} year={year} onChange={onMonthChange} />
      <div className="card">
        <div className="card-title">Расходы по категориям</div>
        {sorted.length === 0 ? (
          <div className="empty">Нет расходов за этот месяц</div>
        ) : (
          sorted.map(([id, val]) => {
            const cat = getCat(id, customCats);
            const pct = total > 0 ? (val / total * 100) : 0;
            return (
              <div className="cat-row" key={id}>
                <div className="cat-row-label">{cat.icon} {cat.label}</div>
                <div className="cat-bar-bg">
                  <div className="cat-bar" style={{ width: `${pct.toFixed(1)}%`, background: cat.color }} />
                </div>
                <div className="cat-row-amount">{fmt(val)}</div>
              </div>
            );
          })
        )}
        {total > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
            <span>Итого расходов</span><span style={{ color: '#D85A30' }}>{fmt(total)}</span>
          </div>
        )}
      </div>
    </>
  );
}
