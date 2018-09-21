import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './components/App';
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from './reducers/index';
import rootSaga from './sagas/rootSaga';

const path = window.location.pathname;

if (path.startsWith("/admin/awesome_proofing")) {
  const reviewerProofingActions = document.querySelector(".reviewer-proofing-actions");
  const newDiv = document.createElement("div");
  newDiv.id = "root";
  reviewerProofingActions.append(newDiv);
} else {
  let nodes = Array.from(document.querySelector('.content-l').children);
  let node = nodes[nodes.length - 1];
  const newDiv = document.createElement("div");
  newDiv.id = "root";
  newDiv.className = "e-fieldset";
  node.parentElement.append(newDiv);
}

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware)
  )
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , 
document.getElementById('root'));