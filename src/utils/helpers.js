// src/utils/helpers.js
import { DEFAULT_CATS_EXPENSE, DEFAULT_CATS_INCOME, WALLETS } from './constants';

export const fmt = (n) =>
  Math.round(n).toLocaleString('ru-KZ') + ' ₸';

export const fmtFull = (n, decimals = 0) =>
  n.toLocaleString('ru-KZ', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export const getCat = (id, customCats = { expense: [], income: [] }) => {
  const all = [
    ...DEFAULT_CATS_EXPENSE,
    ...DEFAULT_CATS_INCOME,
    ...(customCats.expense || []),
    ...(customCats.income || []),
  ];
  return all.find((c) => c.id === id) || { label: id, icon: '📌', color: '#888' };
};

export const getWallet = (id) =>
  WALLETS.find((w) => w.id === id) || { label: id, icon: '💰', color: '#888', commissionRate: 0 };

export const allCats = (type, customCats = { expense: [], income: [] }) => {
  const base = type === 'expense' ? DEFAULT_CATS_EXPENSE : DEFAULT_CATS_INCOME;
  return [...base, ...(customCats[type] || [])];
};

export const todayISO = () => new Date().toISOString().split('T')[0];

export const dateLabel = (iso, monthsShort) => {
  const d = new Date(iso);
  return `${d.getDate()} ${monthsShort[d.getMonth()]}`;
};
