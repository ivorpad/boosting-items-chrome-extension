import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const proofingActionForms = document.querySelector(".proofing-action-forms");
const newDiv = document.createElement("div");
newDiv.id = "root";
proofingActionForms.prepend(newDiv);
ReactDOM.render(<App />, document.getElementById('root'));

