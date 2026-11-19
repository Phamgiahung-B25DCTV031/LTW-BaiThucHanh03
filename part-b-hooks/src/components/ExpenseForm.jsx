import React, { useRef, useState } from 'react';
import { CATEGORIES, getToday, validateExpense } from '../constants.js';
export default function ExpenseForm({ onAdd, isSaving }) {
  const [form, setForm] = useState({ title: '', amount: '', category: CATEGORIES[0], date: getToday() });
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  const change = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); setError(''); };
  const submit = async (event) => {
    event.preventDefault();
    const validation = validateExpense(form);
    if (validation) { setError(validation); return; }
    try {
      await onAdd({ title: form.title.trim(), amount: Number(form.amount), category: form.category, date: form.date });
      setForm({ title: '', amount: '', category: CATEGORIES[0], date: getToday() });
      titleRef.current?.focus();
    } catch (err) { setError(err.message || 'Không thể thêm khoản chi.'); }
  };
  return <section className="panel"><h2>Thêm khoản chi</h2><form onSubmit={submit} noValidate>
    <div className="field"><label htmlFor="b-title">Nội dung</label><input ref={titleRef} id="b-title" maxLength="101" value={form.title} onChange={e => change('title', e.target.value)} placeholder="Ví dụ: Ăn trưa" /></div>
    <div className="field"><label htmlFor="b-amount">Số tiền (VNĐ)</label><input id="b-amount" type="number" step="1" min="1" value={form.amount} onChange={e => change('amount', e.target.value)} placeholder="50000" /></div>
    <div className="field"><label htmlFor="b-category">Loại chi</label><select id="b-category" value={form.category} onChange={e => change('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
    <div className="field"><label htmlFor="b-date">Ngày chi</label><input id="b-date" type="date" max={getToday()} value={form.date} onChange={e => change('date', e.target.value)} /></div>
    {error && <p className="message" role="alert">{error}</p>}
    <button type="submit" className="primary" disabled={isSaving}>{isSaving ? 'Đang thêm...' : '+ Thêm khoản chi'}</button>
  </form></section>;
}
