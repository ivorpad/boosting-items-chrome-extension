import { takeLatest, takeEvery, call, take, fork, put, race, join, cancel } from "redux-saga/effects";
import { delay } from 'redux-saga'
import {
ON_LOGIN_REQUEST,
ON_LOGIN_REQUEST_SUCCESS,
ON_LOGIN_REQUEST_FAILURE,
ON_LOGIN_ACTION,
ON_SIGN_OUT } from '../constants/sagas';

function *verifyToken(token) {
  while (true) {
    const tokenInfo = yield fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    return yield tokenInfo.json();
  }
}


const requestAuthToken = (type) => {
  return new Promise((resolve, reject) => {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage(
    { type },
    function (response) {
      if(response) {
        resolve(response.access_token);
      } else {
        // TODO: Handle error
        reject(response);
      }
    }
  )
  })
}

const storeToken = (token, tokenInfo) => {
  localStorage.setItem('session_access_token', JSON.stringify({ access_token: token, expires_in: tokenInfo }));
}

const getStoredToken = () => localStorage.getItem("session_access_token");


const removeStoredToken = () => {
  localStorage.removeItem("session_access_token");
}

function *authorize(refresh) {
  try {

    //if refresh is true call requestAuthToken with 'refresh' to get a token without interactivity.

    let token = yield call(requestAuthToken, refresh ? "refresh" : "login");
    let tokenInfo = yield call(verifyToken, token);

    yield call(storeToken, token, tokenInfo.expires_in);
    yield put(actions.handleLoginSuccess(token));
    
    return {
      access_token: token,
      expires_in: tokenInfo.expires_in
    };
  } catch (error) {
    yield call(storeToken, null);
    yield put(actions.loginFailure(error))
    console.log(error)
  }
}

function *authorizeLoop(token) {
  try {
    while(true) {    
      const refresh = token != null;
      token = yield call(authorize, refresh);
      if (token.access_token == null) return;
      yield call(delay, 10000);
    }
  } catch (error) {
    console.log(error)
  }
}

function *authenticate() {
  const storedTokenInfo = yield call(getStoredToken);
  while(true) {

    // if the token stored in localStorage does not exist the try to login
    // ON_LOGIN_ACTION is dispatched by the login button. 
    if (!storedTokenInfo) yield take(ON_LOGIN_ACTION); 

    // initiate the authorizeLoop and pass the token if it exists.
    const authLoopTask = yield fork(authorizeLoop, storedTokenInfo);

    const {signOut} = yield race({
      signOut: take(ON_SIGN_OUT),
      authLoop: join(authLoopTask)
    });

    if (signOut) {
      yield call(removeStoredToken)
      yield cancel(authLoopTask)
    }
  }
}

export function *requestAuthWatcher() {
  yield [
    takeLatest(ON_LOGIN_REQUEST, authenticate),
  ]
}

export const actions = {
  handleLogin: (payload) => ({ type: ON_LOGIN_REQUEST, payload }),
  handleLoginAction: () => ({ type: ON_LOGIN_ACTION }),
  handleLoginSuccess: (payload) => ({ type: ON_LOGIN_REQUEST_SUCCESS, payload }),
  loginFailure: (error) => ({ type: ON_LOGIN_REQUEST_FAILURE, error }),
  handleSignOut: () => ({type: ON_SIGN_OUT })
}