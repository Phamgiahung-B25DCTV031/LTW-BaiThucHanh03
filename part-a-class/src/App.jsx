import React from 'react';
import Clock from './components/Clock.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import { CATEGORIES, INITIAL_EXPENSES, money } from './constants.js';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expenses: INITIAL_EXPENSES.map(x => ({...x})), category: 'Tất cả', search: '', debouncedSearch: '' };
    this.searchTimer = null;
  }
  componentDidMount() { this.updateTitle(); }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.expenses !== this.state.expenses) this.updateTitle();
  }
  componentWillUnmount() { clearTimeout(this.searchTimer); document.title = 'Sổ chi tiêu cá nhân'; }
  updateTitle = () => { document.title = `Tổng chi: ${money(this.state.expenses.reduce((sum, e) => sum + Number(e.amount), 0))}`; };
  addExpense = (expense) => this.setState(prev => ({ expenses: [{ ...expense, id: String(Date.now()) + Math.random().toString(36).slice(2,7) }, ...prev.expenses] }));
  deleteExpense = (id) => { if (window.confirm('Bạn có chắc muốn xóa khoản chi này?')) this.setState(prev => ({ expenses: prev.expenses.filter(e => e.id !== id) })); };
  changeSearch = (value) => { this.setState({ search: value }); clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => this.setState({ debouncedSearch: value }), 350); };
  render() {
    const { expenses, category, search, debouncedSearch } = this.state;
    const visible = expenses.filter(e => (category === 'Tất cả' || e.category === category) && e.title.toLocaleLowerCase('vi').includes(debouncedSearch.trim().toLocaleLowerCase('vi')));
    const stats = CATEGORIES.map(c => ({ category: c, sum: expenses.filter(e => e.category === c).reduce((s, e) => s + Number(e.amount), 0) }));
    return <div className="container">
      <header className="hero"><div><p>Phần A · Class Component</p><h1>Sổ chi tiêu cá nhân</h1><p>Quản lý các khoản chi hằng ngày</p></div><Clock /></header>
      <main className="grid"><ExpenseForm onAdd={this.addExpense}/><section className="panel"><h2>Danh sách khoản chi ({visible.length})</h2><div className="toolbar"><select aria-label="Lọc loại" value={category} onChange={e => this.setState({ category: e.target.value })}><option>Tất cả</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><input className="search" aria-label="Tìm khoản chi" placeholder="Tìm nội dung..." value={search} onChange={e => this.changeSearch(e.target.value)} /></div><ExpenseList items={visible} total={visible.reduce((s,e) => s + Number(e.amount),0)} /></section></main>
      <section className="panel summary"><h2>Thống kê theo loại (toàn bộ)</h2><div className="chips">{stats.map(item => <div className="chip" key={item.category}><span>{item.category}</span><strong>{money(item.sum)}</strong></div>)}</div></section>
    </div>;
  }
}
