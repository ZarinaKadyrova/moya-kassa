// src/App.js
import { useState, useEffect } from 'react';
import './styles/global.css';
import { useCollection, useCategories } from './hooks/useFirestore';
import { Toast, useToast } from './components/Toast';

import Overview    from './components/tabs/Overview';
import Wallets     from './components/tabs/Wallets';
import AddTx       from './components/tabs/AddTx';
import History     from './components/tabs/History';
import Categories  from './components/tabs/Categories';
import Exchange    from './components/tabs/Exchange';
import Manage      from './components/tabs/Manage';

const TABS = [
  { id: 'overview',    icon: '🏠', label: 'Обзор' },
  { id: 'wallets',     icon: '👛', label: 'Кошельки' },
  { id: 'add',         icon: '➕', label: 'Добавить' },
  { id: 'history',     icon: '📋', label: 'История' },
  { id: 'cats',        icon: '📊', label: 'Категории' },
  { id: 'exchange',    icon: '💱', label: 'Обмен' },
  { id: 'manage',      icon: '⚙️', label: 'Настройки' },
];

export default function App() {
  const [tab, setTab] = useState('overview');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const { toast } = useToast();
  const { docs: txns, loading: txLoading, add: addTx, remove: removeTx } = useCollection('transactions', 'createdAt');
  const { docs: exchanges, add: addExc, remove: removeExc } = useCollection('exchanges', 'createdAt');
  const { cats: customCats, addCat, removeCat } = useCategories();

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const handleMonthChange = (delta) => {
    let m = month + delta;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  };

  const handleAddTx = async (data) => {
    await addTx(data);
    setTab('overview');
  };

  const renderTab = () => {
    if (txLoading) return <div className="loading">Загрузка данных...</div>;
    switch (tab) {
      case 'overview':  return <Overview txns={txns} customCats={customCats} month={month} year={year} onMonthChange={handleMonthChange} onDelete={removeTx} />;
      case 'wallets':   return <Wallets txns={txns} month={month} year={year} onMonthChange={handleMonthChange} />;
      case 'add':       return <AddTx customCats={customCats} onAdd={handleAddTx} />;
      case 'history':   return <History txns={txns} customCats={customCats} month={month} year={year} onMonthChange={handleMonthChange} onDelete={removeTx} />;
      case 'cats':      return <Categories txns={txns} customCats={customCats} month={month} year={year} onMonthChange={handleMonthChange} />;
      case 'exchange':  return <Exchange exchanges={exchanges} onAdd={addExc} onDelete={removeExc} />;
      case 'manage':    return <Manage customCats={customCats} onAddCat={addCat} onRemoveCat={removeCat} />;
      default:          return null;
    }
  };

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="topbar-title">
            {TABS.find(t => t.id === tab)?.icon}{' '}
            {TABS.find(t => t.id === tab)?.label}
          </div>
          <div className="topbar-sub">Зарина & Адлет</div>
        </div>
      </div>

      <div className="content">
        {renderTab()}
      </div>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <Toast toast={toast} />
    </div>
  );
}
