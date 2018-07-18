import React, { Component } from 'react'
import SHEET from './helpers/API';
import moment from 'moment';


export default class Form extends Component {

  state = {
    inputValue: '',
  }

  static defaultProps = {
  	formData: {
      boosting: "",
      notable_for: [],
      promotions: []
  	}
  };

  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  componentDidMount() {
    const bigApproveButton = document.getElementById('approve').children['proofing_action'];
    bigApproveButton.addEventListener('click', this.handleApproveClick);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const range = "Sheet1!A2";
    
    const {
    	itemUrl,
    	itemName,
    	reviewerName,
    	formData
    } = this.props

    const dataToInsert = {
    	"range": range,
    	"majorDimension": "ROWS",
    	"values": [
    		[
    			moment(Date.now()).format("MM-DD-YYYY"),
    			itemUrl,
    			itemName,
    			reviewerName,
    			formData.boosting,
          this.validateFormDataArray(formData.notable_for) ? formData.notable_for.join(", ") : '-',
          this.validateFormDataArray(formData.promotions) ? formData.promotions.join(", ") : '-'
    		],
    	]
    }

    // If the token is not null or undefined then set the Authorization header.
    if (this.props.access_token) {
    	SHEET.defaults.headers.post['Authorization'] = `Bearer ${this.props.access_token}`
    }

    SHEET.post(`/${this.props.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, dataToInsert)
    	.then(resp => {
    		console.log(resp)
    	})
    	.catch(e => {
    		console.log(e.response)
    	})
  }

  handleGet = (e) => {
    e.preventDefault();

    SHEET.defaults.headers.get['Authorization'] = `Bearer ${this.props.access_token}`

    SHEET.get(`${this.props.sheetId}/values/Sheet1!A1:D5?key=AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0`)
      .then(r => console.log(r))
      .catch(e => console.log(e.response))

  }

  cloneAndChangeButtonAttr = () => {
    const bigApproveButton = document.getElementById('approve').children['proofing_action'];
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

  validateFormDataArray = (array) => Array.isArray(array) && array.length > 0 && typeof(array) !== 'undefined';
  

  // handle the form submission here.
  handleApproveClick = (e) => {
    
    this.cloneAndChangeButtonAttr();

    const range = "Sheet1!A2";

    const {
      itemUrl,
      itemName,
      reviewerName,
      formData
    } = this.props

    const dataToInsert = {
      "range": range,
      "majorDimension": "ROWS",
      "values": [
        [
          moment(Date.now()).format("MM-DD-YYYY"),
          itemUrl,
          itemName,
          reviewerName,
          formData.boosting,
          this.validateFormDataArray(formData.notable_for) ? formData.notable_for.join(", ") : '-',
          this.validateFormDataArray(formData.promotions) ? formData.promotions.join(", ") : '-'
        ],
      ]
    }

    // If the token is not null or undefined then set the Authorization header.
    if (this.props.access_token) {
      SHEET.defaults.headers.post['Authorization'] = `Bearer ${this.props.access_token}`
    }

    SHEET.post(`/${this.props.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, dataToInsert)
      .then(resp => {
        console.log(resp)
      })
      .catch(e => {
        console.log(e.response)
    })
  }

  handleLogin = (e) => {
    e.preventDefault();
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage({ type: 'login' }, function(response) {
       if(response.access_token) {
         this.props.setToken(response.access_token);
       }
    }.bind(this));
    /*eslint-enable no-undef*/

    
  }

  handleLogout = (e) => {
    e.preventDefault();
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage({ type: 'logout' }, function(response) {
      console.log(response, this);
    }.bind(this));
    /*eslint-enable no-undef*/ 

    this.props.setToken(null)
  }

  render() {
    return (
      <div>
        {
          console.log(this.props.formData)
        }
         <form onSubmit={this.handleSubmit}>
           {/* <input type="text" value={this.state.inputValue} onChange={this.handleInputChange}/> */}
           <input id="send_data" type="submit" value="Submit sample Data"/>
         </form>
          <br/>
         <form onSubmit={this.handleGet}>
            <input type="submit" value="Get sample data"/>
         </form>

          <br/>

            <button onClick={this.handleLogin}>Login</button>
            <button onClick={this.handleLogout}>Logout</button>
      </div>
    )
  }
}
