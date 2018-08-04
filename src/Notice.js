import React, { Component } from 'react'
import ReactDOM from 'react-dom';

//const app_root = document.getElementById('root')
const awesome_proofing = document.querySelector(".awesome-proofing");

export default class Notice extends Component {

  constructor() {
    super();
    this.el = document.createElement('div');
    this.el.className = 'extension__notice'
  }

  componentWillMount = () => {
    awesome_proofing.insertBefore(this.el, awesome_proofing.firstChild);
  }

  componentWillUnmount = () => {
    awesome_proofing.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal (
      this.props.children,
      this.el
    )
  }
}
