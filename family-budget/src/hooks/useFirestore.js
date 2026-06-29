// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, setDoc, updateDoc, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

// Generic real-time collection hook — ordered by date desc
export function useCollection(collName) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collName), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      // Client-side sort: by date desc, then by createdAt desc for same day
      const sorted = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date);
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
      setDocs(sorted);
      setLoading(false);
    }, (err) => {
      console.error('Firestore error:', err);
      setLoading(false);
    });
    return unsub;
  }, [collName]);

  const add = async (data) => {
    await addDoc(collection(db, collName), { ...data, createdAt: serverTimestamp() });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, collName, id));
  };

  const update = async (id, data) => {
    await updateDoc(doc(db, collName, id), data);
  };

  return { docs, loading, add, remove, update };
}

// Exchanges — ordered by date desc
export function useExchanges() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'exchanges'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const sorted = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date);
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
      setDocs(sorted);
    }, (err) => console.error(err));
    return unsub;
  }, []);

  const add = async (data) => {
    await addDoc(collection(db, 'exchanges'), { ...data, createdAt: serverTimestamp() });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, 'exchanges', id));
  };

  return { docs, add, remove };
}

// Categories stored as a single document
export function useCategories() {
  const [cats, setCats] = useState({ expense: [], income: [] });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'categories'), (snap) => {
      if (snap.exists()) setCats(snap.data());
    });
    return unsub;
  }, []);

  const saveCats = async (updated) => {
    await setDoc(doc(db, 'config', 'categories'), updated);
  };

  const addCat = async (cat, type) => {
    const updated = { ...cats, [type]: [...(cats[type] || []), cat] };
    await saveCats(updated);
  };

  const removeCat = async (id, type) => {
    const updated = { ...cats, [type]: cats[type].filter((c) => c.id !== id) };
    await saveCats(updated);
  };

  return { cats, addCat, removeCat };
}

// Live exchange rates
export async function fetchLiveRates() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const rates = {};
    ['USD', 'EUR', 'RUB', 'CNY'].forEach((c) => {
      if (data.rates[c]) rates[c] = 1 / data.rates[c];
    });
    return { rates, live: true };
  } catch {
    return { rates: { USD: 500, EUR: 545, RUB: 5.5, CNY: 69 }, live: false };
  }
}
