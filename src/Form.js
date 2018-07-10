import React, { Component } from 'react'

export default class Form extends Component {

  state = {
    inputValue: ''
  }

  handleInputChange = (e) => {
    console.log(this, e)
    this.setState({
      inputValue: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  }

  render() {
    return (
      <div>
         <form onSubmit={this.handleSubmit}>
           <input type="text" value={this.state.inputValue} onChange={this.handleInputChange}/>
           <input id="google_login" type="submit" value="Login"/>
         </form>
      </div>
    )
  }
}
