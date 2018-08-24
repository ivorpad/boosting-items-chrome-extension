import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from "react-redux";
import App from './App';
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from './reducers/index';

const reviewerProofingActions = document.querySelector(".reviewer-proofing-actions");
const newDiv = document.createElement("div");
newDiv.id = "root";
reviewerProofingActions.append(newDiv);

const sagaMiddleware = createSagaMiddleware();
const middlewares = applyMiddleware(sagaMiddleware);

const store = createStore(
  rootReducer,
  compose(middlewares)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , 
document.getElementById('root'));

