// src/utils/constants.js

export const WALLETS = [
  { id: 'kaspi_pay',    label: 'Kaspi Pay',       icon: '📲', color: '#D85A30', commissionRate: 0.0095 },
  { id: 'kaspi_gold',   label: 'Kaspi Gold',       icon: '💳', color: '#BA7517', commissionRate: 0 },
  { id: 'kaspi_dep',    label: 'Kaspi Депозит',    icon: '🏦', color: '#1D9E75', commissionRate: 0 },
  { id: 'cash_adlet',   label: 'Наличные Адлет',   icon: '💵', color: '#534AB7', commissionRate: 0 },
  { id: 'cash_zarina',  label: 'Наличные Зарина',  icon: '💵', color: '#D4537E', commissionRate: 0 },
];

export const DEFAULT_CATS_EXPENSE = [
  { id: 'food',          label: 'Продукты',        icon: '🛒', color: '#1D9E75', builtIn: true },
  { id: 'cafe',          label: 'Кафе/рестораны',  icon: '☕', color: '#BA7517', builtIn: true },
  { id: 'clothes',       label: 'Одежда',           icon: '👕', color: '#534AB7', builtIn: true },
  { id: 'toys',          label: 'Игрушки/дети',     icon: '🧸', color: '#D4537E', builtIn: true },
  { id: 'transport',     label: 'Транспорт',        icon: '🚌', color: '#378ADD', builtIn: true },
  { id: 'health',        label: 'Здоровье',         icon: '💊', color: '#D85A30', builtIn: true },
  { id: 'home',          label: 'Дом/быт',          icon: '🏠', color: '#888780', builtIn: true },
  { id: 'entertainment', label: 'Развлечения',      icon: '🎬', color: '#993556', builtIn: true },
  { id: 'beauty',        label: 'Красота',          icon: '💅', color: '#D4537E', builtIn: true },
  { id: 'education',     label: 'Образование',      icon: '📚', color: '#0F6E56', builtIn: true },
  { id: 'other',         label: 'Прочее',           icon: '📌', color: '#5F5E5A', builtIn: true },
];

export const DEFAULT_CATS_INCOME = [
  { id: 'salary',    label: 'Зарплата',        icon: '💰', color: '#1D9E75', builtIn: true },
  { id: 'freelance', label: 'Фриланс',          icon: '💻', color: '#378ADD', builtIn: true },
  { id: 'gift',      label: 'Подарок/перевод',  icon: '🎁', color: '#D4537E', builtIn: true },
  { id: 'other_in',  label: 'Прочий доход',     icon: '📈', color: '#5F5E5A', builtIn: true },
];

export const EMOJIS = [
  '🛒','☕','👕','🧸','🚌','💊','🏠','🎬','💅','📚','📌','💰',
  '💻','🎁','📈','🏋️','🎮','✈️','🐾','🌿','🎓','🍕','🎀','🧴',
  '🔧','🚗','🛍️','🏦','📱','💎','🎯','🌟','🍫','🧘','🏥','💇','🎵','📷',
];

export const PALETTE = [
  '#1D9E75','#378ADD','#534AB7','#D4537E','#D85A30',
  '#BA7517','#993556','#888780','#639922','#0F6E56','#3C3489',
];

export const CURRENCIES = ['USD', 'EUR', 'RUB', 'CNY'];
export const CUR_SYMBOLS = { USD: '$', EUR: '€', RUB: '₽', CNY: '¥' };
export const CUR_FLAGS   = { USD: '🇺🇸', EUR: '🇪🇺', RUB: '🇷🇺', CNY: '🇨🇳' };

export const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
export const MONTHS_SHORT = ['янв','фев','мар','апр','май','июн',
  'июл','авг','сен','окт','ноя','дек'];
export const DAYS_RU = ['вс','пн','вт','ср','чт','пт','сб'];

export const PERSONS = ['Зарина', 'Адлет'];
