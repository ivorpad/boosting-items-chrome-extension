import React, { Component } from 'react'
import SheetApi from './helpers/API';
import moment from 'moment';
import { extractDomainName } from './helpers/helpers';

const domain = extractDomainName(window.location.host)

export default class Form extends Component {

  constructor() {
    super();
    this.range = `${domain}!A2`;
    this.market = domain;
  }

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
    //this.cleanTokenIfExpired()
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const sheet = extractDomainName(window.location.host)
    const range = `${sheet}!A2`;
    
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
    chrome.storage.sync.get(["access_token"], function(result) {
        if (!result.access_token) {
          return;
        } 
        console.log(result)
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

  handleGet = (e) => {
    e.preventDefault();

    /*eslint-disable no-undef*/
    chrome.storage.sync.get(["access_token"], function (result) {

    	if (!result.access_token) {
    		return;
      }

      SheetApi.defaults.headers.get['Authorization'] = `Bearer ${result.access_token}`
      SheetApi.get(`${this.props.sheetId}/values/${this.market}!A1:D5?key=AIzaSyB96OBaegaOIfxM_xuXRf2ppUlEh9HKmbc`)
        .then(r => console.log(r))
        .catch(e => console.log(e.response))
    }.bind(this));
    /*eslint-enable no-undef*/


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

  handleApproveClick = (e) => {
    
    this.cloneAndChangeButtonAttr();

    const {
      itemUrl,
      itemName,
      reviewerName,
      formData
    } = this.props

    const dataToInsert = {
      "range": this.range,
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
    	SheetApi.post(`/${this.props.sheetId}/values/${this.range}:append?valueInputOption=USER_ENTERED`, dataToInsert)
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
      <div>
         <form onSubmit={this.handleSubmit}>
           <input id="send_data" type="submit" value="Submit sample Data"/>
         </form>
          <br/>
         <form onSubmit={this.handleGet}>
            <input type="submit" value="Get sample data"/>
         </form>

          <br/>

          {this.props.isLoggedIn ? 
            <button onClick={this.props.handleLogout}>Logout</button> :
            <button onClick={this.props.handleLogin}>Login</button>
          }
      </div>
    )
  }
}
