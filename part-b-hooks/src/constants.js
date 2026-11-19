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