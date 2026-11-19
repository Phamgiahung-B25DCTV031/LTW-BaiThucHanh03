import { INITIAL_EXPENSES } from '../constants.js';
// Configure VITE_MOCKAPI_URL in .env (e.g. https://xxxx.mockapi.io/api/v1).
// If absent, app runs in local demo mode so the project is usable immediately.
const BASE = (import.meta.env.VITE_MOCKAPI_URL || '').replace(/\/+$/, '');
const KEY = 'expense-demo-v1';
export const isDemo = !BASE;
function readLocal() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === null ? INITIAL_EXPENSES.map(x => ({ ...x })) : JSON.parse(saved);
  } catch { return INITIAL_EXPENSES.map(x => ({ ...x })); }
}
function writeLocal(items) { localStorage.setItem(KEY, JSON.stringify(items)); }
async function request(path = '', options = {}) {
  const response = await fetch(`${BASE}/expenses${path}`, { ...options, headers: { 'Content-Type':'application/json', ...options.headers } });
  if (!response.ok) throw new Error(`MockAPI trả về lỗi HTTP ${response.status}. Kiểm tra endpoint và kết nối mạng.`);
  if (response.status === 204) return null;
  return response.json();
}
export async function fetchExpenses() {
  if (isDemo) return readLocal();
  const data = await request();
  if (!Array.isArray(data)) throw new Error('Dữ liệu MockAPI không phải danh sách.');
  return data.map(x => ({ ...x, amount: Number(x.amount) || 0 }));
}
export async function createExpense(expense) {
  if (isDemo) {
    const item = { ...expense, id: String(Date.now()) + Math.random().toString(36).slice(2, 7) };
    writeLocal([item, ...readLocal()]); return item;
  }
  const created = await request('', { method: 'POST', body: JSON.stringify(expense) });
  return { ...created, amount: Number(created.amount) || 0 };
}
export async function removeExpense(id) {
  if (isDemo) { writeLocal(readLocal().filter(x => String(x.id) !== String(id))); return; }
  await request('/' + encodeURIComponent(id), { method: 'DELETE' });
}
