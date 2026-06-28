// src/components/tabs/Exchange.js
import { useState, useEffect } from 'react';
import { CURRENCIES, CUR_SYMBOLS, CUR_FLAGS, MONTHS_SHORT, DAYS_RU, PERSONS } from '../../utils/constants';
import { fetchLiveRates } from '../../hooks/useFirestore';
import { fmt, todayISO } from '../../utils/helpers';
import { showToast } from '../Toast';

export default function Exchange({ exchanges, onAdd, onDelete }) {
  const [rates, setRates] = useState({});
  const [liveStatus, setLiveStatus] = useState('загружаем...');
  const [pair, setPair] = useState('USD');
  const [fromVal, setFromVal] = useState('');
  const [toVal, setToVal] = useState('');
  const [manualRate, setManualRate] = useState('');
  const [date, setDate] = useState(todayISO());
  const [dir, setDir] = useState('sell');
  const [person, setPerson] = useState('Зарина');
  const [note, setNote] = useState('');
  const [excFilter, setExcFilter] = useState('all');

  useEffect(() => {
    fetchLiveRates().then(({ rates: r, live }) => {
      setRates(r);
      setLiveStatus(live ? 'актуальный' : 'ориентировочный');
    });
  }, []);

  const effectiveRate = parseFloat(manualRate) || rates[pair] || 0;
  const sym = CUR_SYMBOLS[pair];

  const calcFrom = (v) => {
    setFromVal(v);
    if (effectiveRate && v) setToVal((parseFloat(v) / effectiveRate).toFixed(2));
    else setToVal('');
  };
  const calcTo = (v) => {
    setToVal(v);
    if (effectiveRate && v) setFromVal((parseFloat(v) * effectiveRate).toFixed(0));
    else setFromVal('');
  };

  const handleSave = async () => {
    const kzt = parseFloat(fromVal);
    const foreign = parseFloat(toVal);
    if (!kzt || !foreign) { showToast('Введите суммы', 'error'); return; }
    if (!date) { showToast('Выберите дату', 'error'); return; }
    if (!effectiveRate) { showToast('Не удалось определить курс', 'error'); return; }
    await onAdd({ currency: pair, kzt, foreign, rate: effectiveRate, date, dir, person, note: note.trim() });
    showToast('Обмен сохранён!');
    setFromVal(''); setToVal(''); setNote('');
  };

  const filtered = excFilter === 'all' ? exchanges : exchanges.filter(e => e.currency === excFilter);

  return (
    <>
      <div className="card">
        <div className="card-title">Калькулятор обмена</div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {CURRENCIES.map(c => (
            <button key={c} onClick={() => { setPair(c); setFromVal(''); setToVal(''); }}
              style={{ flex: 1, padding: '7px 4px', fontSize: 13, fontWeight: 500,
                background: pair === c ? 'var(--text)' : 'var(--bg)',
                color: pair === c ? '#fff' : 'var(--text2)',
                border: '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>
              {CUR_FLAGS[c]} {c}
            </button>
          ))}
        </div>

        <div className="rate-box">
          <span>Курс {pair}/KZT</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="rate-val">{effectiveRate ? `1 ${sym} = ${Math.round(effectiveRate)} ₸` : '—'}</span>
            <span className={`live-tag ${liveStatus !== 'актуальный' ? 'stale' : ''}`}>{liveStatus}</span>
          </div>
        </div>

        <div className="exc-calc">
          <div className="exc-row">
            <span className="exc-sym">₸</span>
            <input className="form-input" type="number" placeholder="0" value={fromVal}
              onChange={e => calcFrom(e.target.value)} inputMode="numeric" />
          </div>
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 18, margin: '4px 0' }}>⇅</div>
          <div className="exc-row">
            <span className="exc-sym">{sym}</span>
            <input className="form-input" type="number" placeholder="0" value={toVal}
              onChange={e => calcTo(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Дата обмена</label>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Курс вручную</label>
            <input className="form-input" type="number" placeholder="Авто" step="0.01" value={manualRate}
              onChange={e => setManualRate(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Направление</label>
            <select className="form-input" value={dir} onChange={e => setDir(e.target.value)}>
              <option value="sell">Продажа ₸ → {sym}</option>
              <option value="buy">Покупка {sym} → ₸</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Кто менял</label>
            <select className="form-input" value={person} onChange={e => setPerson(e.target.value)}>
              {PERSONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Заметка</label>
          <input className="form-input" type="text" placeholder="Halyk bank, аэропорт..." value={note}
            onChange={e => setNote(e.target.value)} />
        </div>

        <button className="btn-primary" onClick={handleSave}>Сохранить обмен</button>
      </div>

      <div className="card">
        <div className="card-title">История обменов</div>
        <div className="filters">
          {['all', ...CURRENCIES].map(f => (
            <button key={f} className={`filter-pill ${excFilter === f ? 'active' : ''}`}
              onClick={() => setExcFilter(f)}>{f === 'all' ? 'Все' : f}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="empty">Нет записей</div>
        ) : (
          filtered.map(e => {
            const d = new Date(e.date);
            const dateStr = `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
            const s = CUR_SYMBOLS[e.currency] || e.currency;
            const isSell = e.dir === 'sell';
            const isZarina = e.person === 'Зарина';
            return (
              <div className="exc-item" key={e.id}>
                <div className="exc-date">
                  <div className="exc-date-main">{dateStr}</div>
                  <div className="exc-date-sub">{DAYS_RU[d.getDay()]} {CUR_FLAGS[e.currency]}</div>
                </div>
                <div className="exc-amounts">
                  <div className="exc-main">
                    {isSell
                      ? <><span style={{color:'#D85A30'}}>−{Math.round(e.kzt).toLocaleString('ru-KZ')} ₸</span> → <span style={{color:'#1D9E75'}}>+{parseFloat(e.foreign).toFixed(2)} {s}</span></>
                      : <><span style={{color:'#1D9E75'}}>+{Math.round(e.kzt).toLocaleString('ru-KZ')} ₸</span> ← <span style={{color:'#D85A30'}}>−{parseFloat(e.foreign).toFixed(2)} {s}</span></>
                    }
                  </div>
                  <div className="exc-sub">
                    {e.note && <span>{e.note} · </span>}
                    <span className={`pb ${isZarina ? 'pb-z' : 'pb-a'}`}>{isZarina ? 'З' : 'А'}</span>
                    {' '}{e.person}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className="exc-rate-pill">1 {s} = {Math.round(e.rate)} ₸</span>
                  <button className="del-btn" onClick={() => onDelete(e.id)}>✕</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
