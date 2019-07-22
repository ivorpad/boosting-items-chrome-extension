import {
  takeLatest,
  takeEvery,
  call,
  take,
  fork,
  put,
  race,
  join,
  cancel,
  cancelled
} from "redux-saga/effects";
import { delay } from "redux-saga";
import {
  ON_LOGIN_INIT,
  ON_LOGIN_INIT_SUCCESS,
  ON_LOGIN_FAILURE,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_ACTION,
  ON_SIGN_OUT,
  AUTH_STATUS_CHECK
} from "../constants/sagas";

// async function tokenData(data) {
//   let a = await verifyToken()
// }

function verifyToken(token) {
  /* eslint-disable no-undef */
  
    return new Promise(resolve => {
      chrome.runtime.sendMessage({
        type: "fetchTokenInfo", token
      }, data => resolve(data))
    }) 

    // const tokenInfo = yield fetch(
    //   `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    // );

    //return yield tokenInfo.json();
}

const requestAuthToken = type => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type }, function(response) {
      if (response.access_token) {
        resolve(response.access_token);
      } else {
        reject(response.error);
      }
    });
  });
};

const storeToken = (access_token, expires_in, logged) => {
  localStorage.setItem(
    "session_access_token",
    JSON.stringify({ access_token, expires_in, logged })
  );
};

const getStoredToken = () => localStorage.getItem("session_access_token");

const removeStoredToken = () => {
  localStorage.removeItem("session_access_token");
};

function* authorize(refresh, storedToken) {
  try {
    let token;
    let expires_in;
        
    if (!storedToken) {
      token = yield call(requestAuthToken, "login");
      if (token) {
        ({ expires_in } = yield call(verifyToken, token));
        yield call(storeToken, token, expires_in, "true");
      }
    } else {

      let storedToken = yield call(getStoredToken);

      var { access_token } = JSON.parse(storedToken);
      ({ expires_in } = yield call(verifyToken, access_token));

      if (refresh && Number(expires_in) <= 900) {
        token = yield call(requestAuthToken, "refresh");
        yield call(storeToken, token, expires_in, "true");
      } else {
        token = access_token;
      }
    }

    yield put(actions.handleLoginSuccess(token));

    return {
      access_token: access_token || token,
      expires_in: expires_in
    };
  } catch (error) {
    yield call(removeStoredToken);
    yield put(actions.loginFailure(error));
  }
}

function* authorizeLoop(token) {
  try {
    while (true) {
      const refresh = token != null;

      token = yield call(authorize, refresh, token);
      if (token == null) return;
      const fortyFiveMinutes = (token.expires_in - 900) * 1000;
      yield call(delay, fortyFiveMinutes);
    }
  } finally {
    if (yield cancelled()) {
      console.log("task cancelled");
    }
  }
}

function* authenticate() {
  let storedTokenInfo = yield call(getStoredToken);

  if (storedTokenInfo) {
    yield put(actions.authStatusCheck(storedTokenInfo));
  }

  const authLoopTask = yield fork(authorizeLoop, storedTokenInfo);

  const { signOut } = yield race({
    signOut: yield take(ON_SIGN_OUT),
    authLoop: join(authLoopTask)
  });

  if (signOut) {
    yield call(removeStoredToken);
    yield cancel(authLoopTask);
  }
}

function* loginInit() {
  let stored = yield call(getStoredToken);

  if (!stored) {
    yield takeEvery(ON_LOGIN_ACTION, authenticate);
  } else {
    yield call(authenticate);
  }
}

export function* requestAuthWatcher() {
  yield [takeLatest(ON_LOGIN_INIT, loginInit)];
}

export const actions = {
  handleLoginInit: payload => ({ type: ON_LOGIN_INIT, payload }),
  handleLoginAction: () => ({ type: ON_LOGIN_ACTION }),
  handleLoginSuccess: token => ({ type: ON_LOGIN_INIT_SUCCESS, token }),
  loginFailure: error => ({ type: ON_LOGIN_FAILURE, error }),
  loginSuccess: () => ({ type: ON_LOGIN_SUCCESS }),
  handleSignOut: () => ({ type: ON_SIGN_OUT }),
  authStatusCheck: payload => ({ type: AUTH_STATUS_CHECK, payload })
};