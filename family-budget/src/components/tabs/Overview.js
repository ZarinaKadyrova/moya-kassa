// src/components/tabs/Overview.js
import MonthNav from '../MonthNav';
import TxItem from '../TxItem';
import { fmt } from '../../utils/helpers';

export default function Overview({ txns, customCats, month, year, onMonthChange, onDelete }) {
  const monthTxns = txns.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  return (
    <>
      <MonthNav month={month} year={year} onChange={onMonthChange} />

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Доходы</div>
          <div className="metric-val income">{fmt(income)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Расходы</div>
          <div className="metric-val expense">{fmt(expense)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Остаток</div>
          <div className={`metric-val ${balance >= 0 ? 'pos' : 'neg'}`}>{fmt(balance)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Последние операции</div>
        {monthTxns.length === 0 ? (
          <div className="empty">Нет операций за этот месяц</div>
        ) : (
          monthTxns.slice(0, 10).map(tx => (
            <TxItem key={tx.id} tx={tx} customCats={customCats} onDelete={onDelete} />
          ))
        )}
      </div>
    </>
  );
}
