import React from 'react';
export default class Clock extends React.Component {
  constructor(props) { super(props); this.state = { now: new Date() }; this.timer = null; }
  componentDidMount() { this.timer = setInterval(() => this.setState({ now: new Date() }), 1000); }
  componentWillUnmount() { clearInterval(this.timer); }
  render() { return <div className="clock" aria-label="Đồng hồ">{this.state.now.toLocaleTimeString('vi-VN')}</div>; }
}
