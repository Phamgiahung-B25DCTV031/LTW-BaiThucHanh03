import React from 'react';
import { money } from '../constants.js';
export default class ExpenseList extends React.Component {
  render() {
    const { items, onDelete, total } = this.props;
    return <><ul className="list">{items.length === 0 ? <li className="empty">Không tìm thấy khoản chi nào.</li> : items.map(item => <li className="expense" key={item.id}><div><h3>{item.title}</h3><span className="muted">{item.category} • {item.date.split('-').reverse().join('/')}</span></div><div className="right"><span className="amount">{money(item.amount)}</span><button className="small" onClick={() => onDelete(item.id)}>Xóa</button></div></li>)}</ul>
      <div className="total"><span>Tổng các khoản đang hiển thị</span><span>{money(total)}</span></div></>;
  }
}
