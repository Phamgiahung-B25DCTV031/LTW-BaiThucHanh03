import React from 'react';
import { CATEGORIES, getToday, validateExpense } from '../constants.js';
export default class ExpenseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '', amount: '', category: CATEGORIES[0], date: getToday(), error: '' };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const error = validateExpense(this.state);
    if (error) { this.setState({ error }); return; }
    this.props.onAdd({ title: this.state.title.trim(), amount: Number(this.state.amount), category: this.state.category, date: this.state.date });
    this.setState({ title: '', amount: '', category: CATEGORIES[0], date: getToday(), error: '' });
  };
  render() {
    return <section className="panel"><h2>Thêm khoản chi</h2><form onSubmit={this.handleSubmit} noValidate>
      <div className="field"><label htmlFor="a-title">Nội dung</label><input id="a-title" maxLength="101" value={this.state.title} onChange={e => this.setState({ title: e.target.value, error: '' })} placeholder="Ví dụ: Ăn trưa" /></div>
      <div className="field"><label htmlFor="a-amount">Số tiền (VNĐ)</label><input id="a-amount" type="number" min="1" step="1" value={this.state.amount} onChange={e => this.setState({ amount: e.target.value, error: '' })} placeholder="50000" /></div>
      <div className="field"><label htmlFor="a-category">Loại chi</label><select id="a-category" value={this.state.category} onChange={e => this.setState({ category: e.target.value })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div className="field"><label htmlFor="a-date">Ngày chi</label><input id="a-date" type="date" max={getToday()} value={this.state.date} onChange={e => this.setState({ date: e.target.value })} /></div>
      {this.state.error && <p className="message" role="alert">{this.state.error}</p>}
      <button className="primary" type="submit">+ Thêm khoản chi</button>
    </form></section>;
  }
}
