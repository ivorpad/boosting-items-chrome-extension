import React, { Component } from 'react'
import SHEET from './helpers/API';


export default class Form extends Component {

  state = {
    inputValue: '',
    onFormSubmitted: false,
    onFormSubmittedError: false
  }

  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  componentDidMount() {
    const bigApproveButton = Array.from(document.getElementsByName('proofing_action')).filter(v => v.value === 'approve')[0];
    bigApproveButton.addEventListener('click', this.handleApproveClick);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const range = "Sheet1!A2";
  
    const data = {
      "range": range,
      "majorDimension": "ROWS",
      "values": [
        [this.state.inputValue, this.props.name],
      ]
    }

    // If the token is not null or undefined then set the Authorization header.
    if(this.props.token) {
      SHEET.defaults.headers.post['Authorization'] = `Bearer ${this.props.token}`
    }

    SHEET.post(`/${this.props.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, data)
    .then(resp => console.log(resp))
    .catch(e => console.log(e.response))
  }

  handleGet = (e) => {
    e.preventDefault();

    SHEET.defaults.headers.get['Authorization'] = `Bearer ${this.props.token}`

    SHEET.get(`${this.props.sheetId}/values/Sheet1!A1:D5?key=AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0`)
      .then(r => console.log(r))
      .catch(e => console.log(e.response))

  }

  cloneAndChangeButtonAttr = () => {
    const bigApproveButton = Array.from (
    	document.getElementsByName('proofing_action')
    ).filter(v => v.value === 'approve')[0];
    const approveAction = document.getElementById('approve');
    let newButton = bigApproveButton.cloneNode(true);
    
    bigApproveButton.style.display = 'none';
    
    newButton.name = '';
    newButton.value = '';
    newButton.innerText = 'Approving item...';
    newButton.style.display = 'block';
    newButton.setAttribute('disabled', true);
    
    approveAction.append(newButton);
  } 

  // handle the form submission here.
  handleApproveClick = (e) => {
    
    this.cloneAndChangeButtonAttr();

    const range = "Sheet1!A2";

    const data = {
      "range": range,
      "majorDimension": "ROWS",
      "values": [
        [this.state.inputValue, this.props.name],
      ]
    }

    // If the token is not null or undefined then set the Authorization header.
    if (this.props.token) {
      SHEET.defaults.headers.post['Authorization'] = `Bearer ${this.props.token}`
    }

    SHEET.post(`/${this.props.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, data)
      .then(resp => {
        console.log(resp)
        this.setState({
          onFormSubmitted: true,
          onFormSubmittedError: false
        })
      })
      .catch(e => {
        console.log(e.response)
        this.setState({
          onFormSubmitted: true,
          onFormSubmittedError: true
        })
    })
  }

  render() {
    console.log(this.state)
    return (
      <div>
         <form onSubmit={this.handleSubmit}>
           <input type="text" value={this.state.inputValue} onChange={this.handleInputChange}/>
           <input id="google_login" type="submit" value="Login"/>
         </form>

         <form onSubmit={this.handleGet}>
            <input type="submit" value="get data"/>
         </form>
      </div>
    )
  }
}
