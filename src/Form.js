import React, { Component } from 'react'
import SheetApi from './helpers/API';
import moment from 'moment';
import { extractDomainName } from './helpers/helpers';

const domain = extractDomainName(window.location.host)
const range = `${domain}!A2`;

export default class Form extends Component {

  static defaultProps = {
  	formData: {
  		boosting: "",
  		notable_for: [],
  		promotions: []
  	}
  };
  
  state = {
    inputValue: '',
  }

  componentDidMount() {
    const bigApproveButton = document.getElementById('approve').children['proofing_action'];
    bigApproveButton.addEventListener('click', this.handleApproveClick);
  }

  // TODO: Placeholder for later use to fetch data from Sheets
  // handleGet = (e) => {
  //   e.preventDefault();

  //   /*eslint-disable no-undef*/
  //   chrome.storage.sync.get(["access_token"], function (result) {

  //   	if (!result.access_token) {
  //   		return;
  //     }

  //     SheetApi.defaults.headers.get['Authorization'] = `Bearer ${result.access_token}`
  //     SheetApi.get(`${this.props.sheetId}/values/${domain}!A1:D5?key=AIzaSyB96OBaegaOIfxM_xuXRf2ppUlEh9HKmbc`)
  //       .then(r => console.log(r))
  //       .catch(e => console.log(e.response))
  //   }.bind(this));
  //   /*eslint-enable no-undef*/
  // }

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

  handleApproveClick = (e) => {
    
    this.cloneAndChangeButtonAttr();

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

    /*eslint-disable no-undef*/
    chrome.storage.sync.get(["access_token"], function (result) {
    	if (!result.access_token) {
    		return;
    	}
    	SheetApi.defaults.headers.post['Authorization'] = `Bearer ${result.access_token}`;
    	SheetApi.post(`/${this.props.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, dataToInsert)
    		.then(resp => {
    			console.log(resp)
    		})
    		.catch(e => {
    			console.log(e.response)
    		});
    	// }
    }.bind(this));
    /*eslint-enable no-undef*/
  }

  render() {
    return (
      <React.Fragment>
          {this.props.isLoggedIn ? 
            <button onClick={this.props.handleLogout}>Logout</button> :
            <button onClick={this.props.handleLogin}>Login with Google</button>
          }
      </React.Fragment>
    )
  }
}
