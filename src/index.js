import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from "react-redux";
import App from './App';
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"; 

// TODO: Use combineReducers
import marketplace from "./reducers/marketplace";

const reviewerProofingActions = document.querySelector(".reviewer-proofing-actions");
const newDiv = document.createElement("div");
newDiv.id = "root";
reviewerProofingActions.append(newDiv);
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(marketplace);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , 
document.getElementById('root'));

