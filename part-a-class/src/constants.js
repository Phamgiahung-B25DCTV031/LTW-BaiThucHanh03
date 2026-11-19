export const CATEGORIES = [
  'Ăn uống',
  'Đi lại',
  'Học tập',
  'Giải trí'
];

export const formatMoney = (amount) =>
  Number(amount).toLocaleString('vi-VN') + ' đ';

export function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function validateExpense({ title, amount, category, date }) {
  if (!title || !title.trim()) {
    return 'Vui lòng nhập nội dung khoản chi.';
  }

  if (title.trim().length > 100) {
    return 'Nội dung tối đa 100 ký tự.';
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return 'Số tiền phải lớn hơn 0.';
  }

  if (!CATEGORIES.includes(category)) {
    return 'Loại chi không hợp lệ.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 'Ngày chi không hợp lệ.';
  }

  const [year, month, day] = date.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return 'Ngày chi không hợp lệ.';
  }

  if (date > getToday()) {
    return 'Không nhập ngày trong tương lai.';
  }

  return '';
}
export const money = (amount) =>
  Number(amount).toLocaleString('vi-VN') + ' đ';
export const INITIAL_EXPENSES = [
  {
    id: 1,
    title: 'Ăn sáng',
    amount: 30000,
    category: 'Ăn uống',
    date: '2026-11-19'
  },
  {
    id: 2,
    title: 'Đổ xăng',
    amount: 50000,
    category: 'Đi lại',
    date: '2026-11-18'
  },
  {
    id: 3,
    title: 'Mua sách',
    amount: 120000,
    category: 'Học tập',
    date: '2026-11-17'
  },
  {
    id: 4,
    title: 'Xem phim',
    amount: 85000,
    category: 'Giải trí',
    date: '2026-11-16'
  }
];