// src/components/tabs/AddTx.js
import { useState, useEffect } from 'react';
import { WALLETS, PERSONS } from '../../utils/constants';
import { allCats, getWallet, fmt, todayISO } from '../../utils/helpers';
import { showToast } from '../Toast';

export default function AddTx({ customCats, onAdd }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [wallet, setWallet] = useState('kaspi_pay');
  const [category, setCategory] = useState('');
  const [person, setPerson] = useState('Зарина');
  const [note, setNote] = useState('');

  const cats = allCats(type, customCats);

  useEffect(() => {
    if (cats.length > 0) setCategory(cats[0].id);
  }, [type]); // eslint-disable-line

  const w = getWallet(wallet);
  const isKaspiIncome = type === 'income' && w.commissionRate > 0;
  const amountNum = parseFloat(amount) || 0;
  const commission = isKaspiIncome ? Math.round(amountNum * w.commissionRate) : 0;
  const net = amountNum - commission;

  const handleSubmit = async () => {
    if (!amountNum || amountNum <= 0) { showToast('Введите сумму', 'error'); return; }
    if (!date) { showToast('Выберите дату', 'error'); return; }

    await onAdd({
      type, amount: isKaspiIncome ? net : amountNum,
      grossAmount: isKaspiIncome ? amountNum : null,
      commission: commission || null,
      date, wallet, category, person, note: note.trim(),
    });

    showToast(commission ? `Записано: +${fmt(net)} (комиссия ${fmt(commission)})` : 'Запись добавлена!');
    setAmount(''); setNote('');
  };

  return (
    <div className="card">
      <div className="card-title">Новая запись</div>

      <div className="type-toggle">
        <button className={`type-btn ${type === 'expense' ? 'active expense' : ''}`} onClick={() => setType('expense')}>
          ↑ Расход
        </button>
        <button className={`type-btn ${type === 'income' ? 'active income' : ''}`} onClick={() => setType('income')}>
          ↓ Доход
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Сумма (₸)</label>
          <input className="form-input" type="number" placeholder="0" value={amount}
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

      {isKaspiIncome && amountNum > 0 && (
        <div className="commission-notice">
          <span>ℹ️</span>
          <span>Kaspi Pay удержит 0,95% = <strong>{fmt(commission)}</strong> → зачислится <strong>{fmt(net)}</strong></span>
        </div>
      )}
      {isKaspiIncome && amountNum === 0 && (
        <div className="commission-notice">
          <span>ℹ️</span>
          <span>Komиссия Kaspi Pay 0,95% будет удержана автоматически</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Кто добавляет</label>
          <select className="form-input" value={person} onChange={e => setPerson(e.target.value)}>
            {PERSONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Описание</label>
          <input className="form-input" type="text" placeholder="Необязательно"
            value={note} onChange={e => setNote(e.target.value)} />
        </div>
      </div>

      <button className="btn-primary" onClick={handleSubmit}>Добавить запись</button>
    </div>
  );
}
