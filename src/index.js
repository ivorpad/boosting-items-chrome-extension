import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from "react-redux";
import App from './App';
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"; 
import rootReducer from './reducers/index';
import marketplace from "./reducers/marketplace";

// TODO: Use combineReducers
const reviewerProofingActions = document.querySelector(".reviewer-proofing-actions");
const newDiv = document.createElement("div");
newDiv.id = "root";
reviewerProofingActions.append(newDiv);
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , 
document.getElementById('root'));

