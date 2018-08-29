import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from "react-redux";
import App from './App';
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from './reducers/index';
import rootSaga from './sagas/rootSaga';

const reviewerProofingActions = document.querySelector(".reviewer-proofing-actions");
const newDiv = document.createElement("div");
newDiv.id = "root";
reviewerProofingActions.append(newDiv);

const sagaMiddleware = createSagaMiddleware();
const middlewares = applyMiddleware(sagaMiddleware);

export const store = createStore(
  rootReducer,
  compose(middlewares)
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , 
document.getElementById('root'));

