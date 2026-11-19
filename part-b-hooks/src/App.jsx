import React, { useEffect, useMemo, useState } from 'react';
import ExpenseForm from './components/ExpenseForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import { useTheme } from './context/ThemeContext.jsx';
import useClock from './hooks/useClock.js';
import useDebounce from './hooks/useDebounce.js';
import { createExpense, fetchExpenses, isDemo, removeExpense } from './services/expenseApi.js';
import { CATEGORIES, money } from './constants.js';
export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [retry, setRetry] = useState(0);
  const now = useClock();
  const query = useDebounce(search, 350);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    fetchExpenses().then(data => { if (active) setExpenses(data); })
      .catch(err => { if (active) setError(err.message || 'Không thể tải dữ liệu.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const allTotal = useMemo(() => expenses.reduce((sum,e) => sum + Number(e.amount), 0), [expenses]);
  useEffect(() => { document.title = `Tổng chi: ${money(allTotal)}`; return () => { document.title = 'Sổ chi tiêu cá nhân'; }; }, [allTotal]);
  const visible = useMemo(() => expenses.filter(e => (category === 'Tất cả' || e.category === category) && String(e.title).toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'))), [expenses,category,query]);
  const stats = useMemo(() => CATEGORIES.map(c => ({ category:c, sum:expenses.filter(e => e.category === c).reduce((sum,e) => sum + Number(e.amount), 0) })), [expenses]);
  const add = async (item) => {
    setSaving(true); setError('');
    try { const created = await createExpense(item); setExpenses(prev => [created,...prev]); }
    catch (err) { setError(err.message || 'Không thể thêm.'); throw err; }
    finally { setSaving(false); }
  };
  const del = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khoản chi này?')) return;
    setDeletingId(id); setError('');
    try { await removeExpense(id); setExpenses(prev => prev.filter(e => String(e.id) !== String(id))); }
    catch (err) { setError(err.message || 'Không thể xóa.'); }
    finally { setDeletingId(null); }
  };
  return <div className={theme === 'dark' ? 'dark' : ''}><div className="container">
    <header className="hero"><div><p>Phần B · Function Component + Hooks</p><h1>Sổ chi tiêu cá nhân</h1><p>Quản lý các khoản chi hằng ngày</p></div><div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}><div className="clock" aria-label="Đồng hồ">{now.toLocaleTimeString('vi-VN')}</div><button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}</button></div></header>
    {isDemo && <div className="banner">Đang dùng chế độ demo (localStorage). Muốn kết nối MockAPI, hãy tạo file <code>.env</code> theo README và khởi động lại Vite.</div>}
    <main className="grid"><ExpenseForm onAdd={add} isSaving={saving || loading}/><section className="panel"><h2>Danh sách khoản chi ({visible.length})</h2><div className="toolbar"><select aria-label="Lọc loại" value={category} onChange={e => setCategory(e.target.value)}><option>Tất cả</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><input className="search" aria-label="Tìm khoản chi" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm nội dung..." /></div>
      {error && <div className="errorbox" role="alert">{error} <button onClick={() => setRetry(v => v + 1)}>Tải lại</button></div>}
      {loading ? <div className="empty">Đang tải dữ liệu...</div> : <ExpenseList items={visible} onDelete={del} deletingId={deletingId} total={visible.reduce((s,e) => s + Number(e.amount),0)} />}
    </section></main>
    <section className="panel summary"><h2>Thống kê theo loại (toàn bộ)</h2><div className="chips">{stats.map(item => <div className="chip" key={item.category}><span>{item.category}</span><strong>{money(item.sum)}</strong></div>)}</div></section>
  </div></div>;
}
