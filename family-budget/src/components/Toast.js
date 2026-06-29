// src/components/Toast.js
import { useState, useCallback } from 'react';

let toastFn = null;

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  toastFn = show;
  return { toast, show };
}

export const showToast = (msg, type) => toastFn && toastFn(msg, type);

export function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`toast ${toast.type}`}>{toast.msg}</div>;
}
