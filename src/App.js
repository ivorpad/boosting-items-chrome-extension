import React, { Component } from 'react';
import './App.css';
import Boosting from './Boosting';
import NotableFor from './NotableFor';
import Promotions from './Promotions';
import Form from './Form';
import axios from 'axios';

// TODO: Remove
const removeItemBundleCountTemp = () => {
  Array.from(document.querySelectorAll('.e-form__label')).filter(function(v, i) {
   return v.innerText === 'Item Bundle Count';
  })[0].parentNode.remove();
}

removeItemBundleCountTemp();


class App extends Component {

  state = {
    greeting: 'Hi reviewer, this is your name:',
    reviewerName: '',
    access_token: '',
    sheetId: '10FeqhDufQ698lx9vAywzB02cT_XTJU7_r7ugQAQMr9M'
  }


  // I need to find a way to send an error response object from content script to background.js
  // if e.response.status === 401 then background.js will receive this status 
  // and if it's 401 then we will generate a new token via getAuthToken({ interactive: false })
  // after we get a new token we need to pass back this data to App.js
  // to we can set a new state for access_token

  
  componentDidMount() {

    const intercomSetup = document.getElementById('intercom-setup');
    const { name } = JSON.parse(intercomSetup.getAttribute('data-intercom-settings-payload'));

    this.setState({
      reviewerName: name
    });
     /*eslint-disable no-undef*/
    chrome.storage.local.get(['token'], (result) => {
      console.log('from App ' + result.token)
      this.setState({
        access_token: result.token
      })
    });
  }

  render() {
    return (
      <div className="App">
          {console.log(this.state)}
          <Boosting />
          <NotableFor />
          <Promotions />
          <Form token={this.state.access_token} sheetId={this.state.sheetId} name={this.state.reviewerName} />

      </div>
    );
  }
}

export default App;
