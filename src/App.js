import React, { Component } from 'react';
import './App.css';
import Boosting from './Boosting';
import NotableFor from './NotableFor';
import Promotions from './Promotions';

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
  }

  componentDidMount() {
    const intercomSetup = document.getElementById('intercom-setup');
    const { name } = JSON.parse(intercomSetup.getAttribute('data-intercom-settings-payload'));

    this.setState({
      reviewerName: name,
    });
  }

  render() {
    return (
      <div className="App">
          
          <Boosting />
          <NotableFor />
          <Promotions />

          {/*this.state.greeting} {this.state.reviewerName*/}


      </div>
    );
  }
}

export default App;
