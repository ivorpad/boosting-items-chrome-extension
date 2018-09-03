import { takeLatest, call, take, fork, put } from "redux-saga/effects";

import {
ON_LOGIN_REQUEST,
ON_LOGIN_REQUEST_SUCCESS,
ON_LOGIN_REQUEST_FAILURE,
ON_LOGIN_USER_REJECTION } from '../constants/sagas';

// const handleChromeMessagePassingAuth = (type) => {
//    return new Promise((resolve, reject) => {
//     // eslint-disable-next-line no-undef
//     chrome.runtime.sendMessage(
//       { type },
//       function (response) {
//         if(response) {
//           resolve(response);
//         } else {
//           reject(response);
//         }
//       }
//     )
//    })
// }

// async function tokenInfo(token) {
//   const token_info = await fetch(
//     `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
//   );
//   return token_info.json();
// }

// function *handleRefresh() {

// }

// TODO: Handle errors
// function *handleLogin() {
//   const response = yield call(handleChromeMessagePassingAuth, "login");
//   yield put(actions.handleLoginSuccess(response))
// }

// export function *handleChromeMessagePassingAuthWatcher() {
//   yield takeLatest(ON_LOGIN_REQUEST, handleLogin)
// }

// export const actions = {
//   handleLogin: (payload) => ({ type: ON_LOGIN_REQUEST, payload }),
//   handleLoginSuccess: (payload) => ({ type: ON_LOGIN_REQUEST_SUCCESS, payload }),
//   loginFailure: (error) => ({ type: ON_LOGIN_REQUEST_FAILURE, error }),
// }


const requestAuthToken = (type) => {
  return new Promise((resolve, reject) => {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage(
    { type },
    function (response) {
      if(response) {
        resolve(response);
      } else {
        reject(response);
      }
    }
  )
  })
}

function *authorize() {
  const token = yield call(requestAuthToken, "login");

  console.log(token)
}

export function *requestAuthWatcher() {
  yield takeLatest(ON_LOGIN_REQUEST, authorize)
}

export const actions = {
  handleLogin: (payload) => ({ type: ON_LOGIN_REQUEST, payload }),
  // handleLoginSuccess: (payload) => ({ type: ON_LOGIN_REQUEST_SUCCESS, payload }),
  // loginFailure: (error) => ({ type: ON_LOGIN_REQUEST_FAILURE, error }),
}