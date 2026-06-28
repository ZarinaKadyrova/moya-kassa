// src/components/tabs/Manage.js
import { useState } from 'react';
import { allCats } from '../../utils/helpers';
import { EMOJIS, PALETTE } from '../../utils/constants';
import { showToast } from '../Toast';

export default function Manage({ customCats, onAddCat, onRemoveCat }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [icon, setIcon] = useState('🏷️');
  const [color, setColor] = useState(PALETTE[0]);

  const handleAdd = async () => {
    if (!name.trim()) { showToast('Введите название', 'error'); return; }
    await onAddCat({ id: 'custom_' + Date.now(), label: name.trim(), icon, color, builtIn: false }, type);
    showToast('Категория добавлена!');
    setName('');
  };

  const expense = allCats('expense', customCats);
  const income = allCats('income', customCats);

  return (
    <div className="card">
      <div className="card-title">Категории</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>Расходы</div>
      {expense.map(c => (
        <div className="manage-item" key={c.id}>
          <span style={{ fontSize: 20 }}>{c.icon}</span>
          <span className="manage-name">{c.label}</span>
          <span className="type-tag expense">расход</span>
          <button className="del-btn" disabled={c.builtIn}
            onClick={() => !c.builtIn && onRemoveCat(c.id, 'expense')}
            style={{ opacity: c.builtIn ? 0.3 : 1 }}>✕</button>
        </div>
      ))}

      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', margin: '12px 0 8px' }}>Доходы</div>
      {income.map(c => (
        <div className="manage-item" key={c.id}>
          <span style={{ fontSize: 20 }}>{c.icon}</span>
          <span className="manage-name">{c.label}</span>
          <span className="type-tag income">доход</span>
          <button className="del-btn" disabled={c.builtIn}
            onClick={() => !c.builtIn && onRemoveCat(c.id, 'income')}
            style={{ opacity: c.builtIn ? 0.3 : 1 }}>✕</button>
        </div>
      ))}

      <div className="divider" />
      <div className="card-title">Добавить категорию</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Название</label>
          <input className="form-input" type="text" placeholder="Например: Спорт"
            value={name} onChange={e => setName(e.target.value)} maxLength={24} />
        </div>
        <div className="form-group">
          <label className="form-label">Тип</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Иконка — выбрана: <span style={{ fontSize: 20 }}>{icon}</span></label>
        <div className="emoji-grid">
          {EMOJIS.map(e => (
            <button key={e} className={`emoji-btn ${e === icon ? 'sel' : ''}`}
              onClick={() => setIcon(e)}>{e}</button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Цвет</label>
        <div className="color-row">
          {PALETTE.map(c => (
            <div key={c} className={`color-dot ${c === color ? 'sel' : ''}`}
              style={{ background: c }} onClick={() => setColor(c)} />
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={handleAdd}>Добавить категорию</button>
    </div>
  );
}
