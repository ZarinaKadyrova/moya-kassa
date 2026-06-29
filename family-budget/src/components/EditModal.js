// src/components/EditModal.js
import { useState } from 'react';
import { WALLETS, PERSONS } from '../utils/constants';
import { allCats } from '../utils/helpers';
import { showToast } from './Toast';

export default function EditModal({ tx, customCats, onSave, onClose }) {
  const [amount, setAmount] = useState(String(tx.grossAmount || tx.amount));
  const [date, setDate] = useState(tx.date);
  const [wallet, setWallet] = useState(tx.wallet || 'kaspi_pay');
  const [category, setCategory] = useState(tx.category);
  const [person, setPerson] = useState(tx.person);
  const [note, setNote] = useState(tx.note || '');
  const [type, setType] = useState(tx.type);

  const cats = allCats(type, customCats);

  const handleSave = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { showToast('Введите сумму', 'error'); return; }
    if (!date) { showToast('Выберите дату', 'error'); return; }

    // recalculate commission if kaspi_pay income
    const w = WALLETS.find(w => w.id === wallet);
    const isKaspiIncome = type === 'income' && w?.commissionRate > 0;
    const commission = isKaspiIncome ? Math.round(amt * w.commissionRate) : 0;
    const finalAmount = isKaspiIncome ? amt - commission : amt;

    await onSave({
      type, amount: finalAmount,
      grossAmount: isKaspiIncome ? amt : null,
      commission: commission || null,
      date, wallet, category, person, note: note.trim(),
    });
    showToast('Запись обновлена!');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)', borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: 480, margin: '0 auto',
        padding: '20px 16px 32px', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Редактировать запись</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text2)' }}>✕</button>
        </div>

        <div className="type-toggle">
          <button className={`type-btn ${type === 'expense' ? 'active expense' : ''}`} onClick={() => setType('expense')}>↑ Расход</button>
          <button className={`type-btn ${type === 'income' ? 'active income' : ''}`} onClick={() => setType('income')}>↓ Доход</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Сумма (₸)</label>
            <input className="form-input" type="number" value={amount}
              onChange={e => setAmount(e.target.value)} inputMode="numeric" />
          </div>
          <div className="form-group">
            <label className="form-label">Дата</label>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Кошелёк</label>
            <select className="form-input" value={wallet} onChange={e => setWallet(e.target.value)}>
              {WALLETS.map(w => <option key={w.id} value={w.id}>{w.icon} {w.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Категория</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Кто</label>
            <select className="form-input" value={person} onChange={e => setPerson(e.target.value)}>
              {PERSONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Описание</label>
            <input className="form-input" type="text" placeholder="Заметка..."
              value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ marginTop: 8 }}>
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
