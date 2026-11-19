import React from 'react';
import { money } from '../constants.js';
export default function ExpenseList({ items, onDelete, total, deletingId }) {
  return <><ul className="list">{items.length === 0 ? <li className="empty">Không tìm thấy khoản chi nào.</li> : items.map(item => <li className="expense" key={item.id}><div><h3>{item.title}</h3><span className="muted">{item.category} • {String(item.date).split('-').reverse().join('/')}</span></div><div className="right"><span className="amount">{money(item.amount)}</span><button className="small" disabled={deletingId !== null} onClick={() => onDelete(item.id)}>{deletingId === item.id ? 'Đang xóa...' : 'Xóa'}</button></div></li>)}</ul><div className="total"><span>Tổng các khoản đang hiển thị</span><span>{money(total)}</span></div></>;
}
