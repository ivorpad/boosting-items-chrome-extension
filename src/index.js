import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const reviewerProofingActions = document.querySelector(".reviewer-proofing-actions");
const newDiv = document.createElement("div");
newDiv.id = "root";
reviewerProofingActions.append(newDiv);
ReactDOM.render(<App />, document.getElementById('root'));

