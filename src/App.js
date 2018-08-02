import React, { Component } from 'react';
import './App.css';
import Boosting from './Boosting';
import Highlights from './Highlights';
import Promotions from './Promotions';
import Button from './Button';
import axios from 'axios';
import SheetApi from './helpers/API';
import moment from 'moment';
import { extractDomainName, removeItemBundleCount } from './helpers/helpers';

const domain = extractDomainName(window.location.host)
const range = `${domain}!A2`;
const baseUrl = "https://tfsnippets.ivorpad.com/wp-json/wp/v2";

removeItemBundleCount();

/*eslint-enable no-undef*/


class App extends Component {

  state = {
    reviewerName: '',
    itemUrl: '',
    itemName: '',
    sheetId: '',
    highlights: [],
    promotions: [],
    inputValue: '',
    isLoading: false,
    isLoggedIn: false,
    startTokenRefresh: JSON.parse(localStorage.getItem('start_token_refresh')),
    formData: {
    	boosting: "Good",
    	notable_for: [],
    	promotions: []
    },
    buttonText: 'Login with Google'
  }

  componentDidMount() {
    const intercomSetup = document.getElementById('intercom-setup');
    const { name } = JSON.parse(intercomSetup.getAttribute('data-intercom-settings-payload'));
    const itemName = document.querySelector('.existing-value').innerText;
    const itemUrl = document.querySelector('.submission-details > a').href;

    this.setState({
      isLoading: true,
      reviewerName: name,
      itemName,
      itemUrl
    });

    axios.all([
      axios.get(`${baseUrl}/post_type_promotion`),
      axios.get(`${baseUrl}/post_type_highlight`)
    ])
    .then(axios.spread((promotionsResponse, highlightsResponse) => {
      if (promotionsResponse.status === 200 && highlightsResponse.status === 200) {
        const { data: promotions } = promotionsResponse
        const { data: highlights } = highlightsResponse
        this.setState({
          promotions,
          highlights,
          isLoading: false
        })
      }
    }))
    .catch(e => console.log(e));

    /* eslint-disable no-undef */
    chrome.storage.sync.get(['sheetIdValue'], function (value) {
    	this.setState({
        sheetId: value.sheetIdValue
      })
    }.bind(this))
    /* eslint-enable no-undef */
  }

  componentWillMount = () => {
    this.checkIfLoggedIn();
    const bigApproveButton = document.getElementById('approve').children['proofing_action'];
    bigApproveButton.addEventListener('click', this.handleApproveClick);

    if(!this.state.isLoggedIn) {
      this.setState({
        buttonText: 'Logout'
      })
    }

  }

  handleLogin = (e) => {
    e.preventDefault();
    
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage({
      type: 'login'
    }, function (response) {
      console.log(response)

      this.setState({
        isLoggedIn: response.isLoggedIn
      });

      if (response.access_token) {
        
        this.handleRefresh();

      }
    }.bind(this));
    
    /*eslint-enable no-undef*/
  }


  handleRefresh = () => {
    /*eslint-disable no-undef*/
      chrome.runtime.sendMessage({
        type: 'refresh'
      }, function(response) {
          console.log(response)
          localStorage.setItem('start_token_refresh', response.startTokenRefresh);
          this.setState({
            startTokenRefresh: JSON.parse(localStorage.getItem('start_token_refresh'))
          })
      }.bind(this))
    /*eslint-enable no-undef*/
  }

  handleLogout = (e) => {
    e.preventDefault();
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage({
      type: 'logout'
    }, function (response) {
      console.log(response);
      this.setState({
        isLoggedIn: response.isLoggedIn
      })
    }.bind(this));
    /*eslint-enable no-undef*/

    //this.setToken(null)
  }

  handleFormData = (values, key) => {  
    this.setState(prevState => {
      return { formData: {
        ...prevState.formData,
        [key]: values
      } }
    });
  }


  // TODO: Improve this method name to also check if the expires_in time is less than 10 minutes
  // so we can re-issue a new token
  checkIfLoggedIn = () => {
  	/*eslint-disable no-undef*/
  	chrome.storage.sync.get(['access_token'], function (result) {
      if(result.access_token) {
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${result.access_token}`)
        	.then(resp => resp.json())
        	.then(val => {
        		if (val.error_description) {
        			throw new Error('Not logged in, please login to continue.')
        		} else {
        			this.setState({
        				isLoggedIn: true
        			})
        		}
        	})
        	.catch(err => {
        		this.setState({
        			isLoggedIn: false
        		})
        	})
      }
  	}.bind(this))
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

  validateFormDataArray = (array) => Array.isArray(array) && array.length > 0 && typeof (array) !== 'undefined';

  handleApproveClick = (e) => {

   	this.cloneAndChangeButtonAttr();

   	const {
   		itemUrl,
   		itemName,
   		reviewerName,
   		formData
   	} = this.state

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
   		SheetApi.post(`/${this.state.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, dataToInsert)
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
      <div className="App">
        
        {this.state.isLoading ? 
            <div> 
              <p>
                Loading...
              </p> 
            </div> :
          
            <React.Fragment>
              
              <hr className="app__separator" />
              <h4 className="app__title">Staff Boosting</h4>

              <Boosting handleFormData={this.handleFormData}/>

              <Highlights
                isLoading={this.state.isLoading} 
                highlightsData={this.state.highlights} 
                handleFormData={this.handleFormData}
              />

              <Promotions 
                isLoading={this.state.isLoading} 
                promotionsData={this.state.promotions} 
                handleFormData={this.handleFormData} 
              />

              {this.state.isLoggedIn ? 
                <Button 
                  value={this.state.buttonText} 
                  isLoggedIn={this.state.isLoggedIn} 
                  handleLogout={this.handleLogout} 
                /> :
                <Button 
                  value={this.state.buttonText} 
                  isLoggedIn={this.state.isLoggedIn} 
                  handleLogin={this.handleLogin} 
                />
              }
            </React.Fragment>
        }

      </div>
    );
  }
}

export default App;
