// src/components/tabs/Wallets.js
import MonthNav from '../MonthNav';
import { WALLETS } from '../../utils/constants';
import { fmt } from '../../utils/helpers';

export default function Wallets({ txns, month, year, onMonthChange }) {
  const balances = {};
  WALLETS.forEach(w => { balances[w.id] = 0; });
  txns.forEach(t => {
    if (balances[t.wallet] !== undefined) {
      balances[t.wallet] += (t.type === 'income' ? 1 : -1) * t.amount;
    }
  });
  const total = Object.values(balances).reduce((s, v) => s + v, 0);

  const monthTxns = txns.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const monthIn = {}, monthOut = {};
  WALLETS.forEach(w => { monthIn[w.id] = 0; monthOut[w.id] = 0; });
  monthTxns.forEach(t => {
    if (t.type === 'income' && monthIn[t.wallet] !== undefined) monthIn[t.wallet] += t.amount;
    if (t.type === 'expense' && monthOut[t.wallet] !== undefined) monthOut[t.wallet] += t.amount;
  });

  return (
    <>
      <div className="wallet-total">
        <div className="wallet-total-label">Итого по всем кошелькам</div>
        <div className="wallet-total-val">{fmt(total)}</div>
      </div>

      <div className="wallets-grid">
        {WALLETS.map(w => {
          const bal = balances[w.id] || 0;
          return (
            <div className="wallet-card" key={w.id}>
              <div className="wallet-icon">{w.icon}</div>
              <div className="wallet-name">{w.label}</div>
              <div className="wallet-bal" style={{ color: bal >= 0 ? '#1A1A18' : '#D85A30' }}>
                {fmt(Math.abs(bal))}
              </div>
              {w.commissionRate > 0 && (
                <div className="wallet-commission">
                  комиссия {(w.commissionRate * 100).toFixed(2)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">Движение за месяц</div>
        <MonthNav month={month} year={year} onChange={onMonthChange} />
        {WALLETS.map(w => {
          const inc = monthIn[w.id] || 0;
          const exp = monthOut[w.id] || 0;
          const net = inc - exp;
          if (!inc && !exp) return null;
          return (
            <div className="tx-item" key={w.id}>
              <div style={{ fontSize: 24, width: 40, textAlign: 'center' }}>{w.icon}</div>
              <div className="tx-info">
                <div className="tx-title">{w.label}</div>
                <div className="tx-meta">
                  <span style={{ color: '#1D9E75' }}>+{fmt(inc)}</span>
                  <span>·</span>
                  <span style={{ color: '#D85A30' }}>−{fmt(exp)}</span>
                </div>
              </div>
              <div className="tx-amount" style={{ color: net >= 0 ? '#1D9E75' : '#D85A30' }}>
                {net >= 0 ? '+' : '−'}{fmt(Math.abs(net))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
