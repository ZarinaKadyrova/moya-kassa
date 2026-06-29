// src/components/TxItem.js
import { getCat, getWallet, fmt } from '../utils/helpers';
import { MONTHS_SHORT } from '../utils/constants';

export default function TxItem({ tx, customCats, onDelete, onEdit }) {
  const cat = getCat(tx.category, customCats);
  const w = getWallet(tx.wallet);
  const d = new Date(tx.date);
  const dateStr = `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  const isZarina = tx.person === 'Зарина';

  return (
    <div className="tx-item">
      <div className="tx-icon" style={{ background: cat.color + '20' }}>
        {cat.icon}
      </div>
      <div className="tx-info">
        <div className="tx-title">{tx.note || cat.label}</div>
        <div className="tx-meta">
          <span>{cat.label}</span>
          <span>·</span>
          <span>{w.icon} {w.label}</span>
          <span>·</span>
          <span>{dateStr}</span>
          <span>·</span>
          <span className={`pb ${isZarina ? 'pb-z' : 'pb-a'}`}>{isZarina ? 'З' : 'А'}</span>
          <span>{tx.person}</span>
          {tx.commission > 0 && (
            <span style={{ color: '#BA7517' }}>−{fmt(tx.commission)} комиссия</span>
          )}
          {tx.fromExchange && (
            <span style={{ color: '#534AB7' }}>💱 обмен</span>
          )}
        </div>
      </div>
      <div className={`tx-amount ${tx.type}`}>
        {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
      </div>
      <button className="del-btn" onClick={() => onEdit(tx)} style={{ fontSize: 14, color: 'var(--blue)' }} title="Редактировать">✏️</button>
      <button className="del-btn" onClick={() => onDelete(tx.id)}>✕</button>
    </div>
  );
}
