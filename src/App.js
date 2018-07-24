import React, { Component } from 'react';
import './App.css';
import Boosting from './Boosting';
import NotableFor from './NotableFor';
import Promotions from './Promotions';
import Form from './Form';
import axios from 'axios';

// TODO: Remove
const removeItemBundleCount = () => {
  Array.from(document.querySelectorAll('.e-form__label')).filter(function(v, i) {
   return v.innerText === 'Item Bundle Count';
  })[0].parentNode.remove();
}

removeItemBundleCount();

/*eslint-enable no-undef*/
const baseUrl = "https://tfsnippets.ivorpad.com/wp-json/wp/v2";

class App extends Component {

  // 10FeqhDufQ698lx9vAywzB02cT_XTJU7_r7ugQAQMr9M

  state = {
    reviewerName: '',
    access_token: '',
    itemUrl: '',
    itemName: '',
    formData: {
    	boosting: "Good" // default value
    },
    sheetId: '',
    highlights: [],
    promotions: [],
    isLoading: false,
    willRefreshToken: false,
    startTokenRefresh: localStorage.getItem('start_token_refresh') || false
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

    if(this.state.startTokenRefresh) {
      /*eslint-disable no-undef*/
      chrome.storage.local.get(['access_token'], function(result) {
        this.setState({
          access_token: result.access_token
        })
      }.bind(this))
      /*eslint-enable no-undef*/
    } else {
      this.setState({
        access_token: localStorage.getItem('access_token') !== "null" ? localStorage.getItem('access_token') : null
      })
    }

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

  handleLogin = (e) => {
    e.preventDefault();
    
    /*eslint-disable no-undef*/

    chrome.runtime.sendMessage({
      type: 'login'
    }, function (response) {
      console.log(response)
      if (response.access_token) {

        const {access_token} = response;

        localStorage.setItem('access_token', access_token)

        this.setState({
          access_token,
          willRefreshToken: true
        });
        
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
            startTokenRefresh: localStorage.getItem('start_token_refresh')
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
    }.bind(this));
    /*eslint-enable no-undef*/

    this.setToken(null)
  }

  handleFormData = (values, key) => {  
    this.setState(prevState => {
      return { formData: {
        ...prevState.formData,
        [key]: values
      } }
    });
  }

  render() {
    return (
      <div className="App">
        <Boosting   handleFormData={this.handleFormData}/>

        {console.log(this.state)}

        <NotableFor 
          isLoading={this.state.isLoading} 
          highlightsData={this.state.highlights} 
          handleFormData={this.handleFormData}
        />

        <Promotions 
          isLoading={this.state.isLoading} 
          promotionsData={this.state.promotions} 
          handleFormData={this.handleFormData} 
        />

        <Form 
          access_token={this.state.access_token} 
          sheetId={this.state.sheetId} 
          reviewerName={this.state.reviewerName}
          setToken={this.setToken}
          itemName={this.state.itemName}
          itemUrl={this.state.itemUrl}
          formData={this.state.formData}
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
        />
      </div>
    );
  }
}

export default App;
