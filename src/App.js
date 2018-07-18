import React, { Component } from 'react';
import './App.css';
import Boosting from './Boosting';
import NotableFor from './NotableFor';
import Promotions from './Promotions';
import Form from './Form';

// TODO: Remove
const removeItemBundleCount = () => {
  Array.from(document.querySelectorAll('.e-form__label')).filter(function(v, i) {
   return v.innerText === 'Item Bundle Count';
  })[0].parentNode.remove();
}

removeItemBundleCount();


class App extends Component {

  state = {
    reviewerName: '',
    access_token: '',
    itemUrl: '',
    itemName: '',
    sheetId: '10FeqhDufQ698lx9vAywzB02cT_XTJU7_r7ugQAQMr9M',
    data: {}
  }
  
  componentDidMount() {
    const intercomSetup = document.getElementById('intercom-setup');
    const { name } = JSON.parse(intercomSetup.getAttribute('data-intercom-settings-payload'));
    const itemName = document.querySelector('.existing-value').innerText;
    const itemUrl = document.querySelector('.submission-details > a').href;

    this.setState({
      reviewerName: name,
      itemName,
      itemUrl,
      access_token: localStorage.getItem('access_token') !== "null" ? localStorage.getItem('access_token') : null,
      formData: {
        boosting: "Good" 
      }
    });
  }

  setToken = (access_token) => {
    localStorage.setItem('access_token', access_token)

    this.setState({
      access_token
    })
  }

  handleLogin = (e) => {
    e.preventDefault();
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage({
      type: 'login'
    }, function (response) {
      if (response.access_token) {
        this.setToken(response.access_token);
      }
    }.bind(this));
    /*eslint-enable no-undef*/
  }

  handleLogout = (e) => {
    e.preventDefault();
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage({
      type: 'logout'
    }, function (response) {
      console.log(response, this);
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
        <NotableFor handleFormData={this.handleFormData}/>
        <Promotions handleFormData={this.handleFormData} />
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
