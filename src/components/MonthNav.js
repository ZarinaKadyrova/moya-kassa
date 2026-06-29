// src/components/MonthNav.js
import { MONTHS_RU } from '../utils/constants';

export default function MonthNav({ month, year, onChange }) {
  return (
    <div className="month-nav">
      <button className="month-nav-btn" onClick={() => onChange(-1)}>‹</button>
      <span className="month-nav-label">{MONTHS_RU[month]} {year}</span>
      <button className="month-nav-btn" onClick={() => onChange(1)}>›</button>
    </div>
  );
}
