import {
  takeLatest,
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
  ON_LOGIN_INIT_FAILURE,
  ON_LOGIN_ACTION,
  ON_SIGN_OUT,
  AUTH_STATUS_CHECK
} from "../constants/sagas";

function* verifyToken(token) {
  while (true) {
    const tokenInfo = yield fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    return yield tokenInfo.json();
  }
}

const requestAuthToken = type => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type }, function(response) {
      if (response) {
        resolve(response.access_token);
      } else {
        // TODO: Handle error
        reject(response);
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
    if (storedToken) {
      var token;
      var { access_token, expires_in } = JSON.parse(storedToken);

      refresh && expires_in <= 900 ? token = yield call(requestAuthToken, "refresh") : token = access_token
    }

    if (!storedToken) token = yield call(requestAuthToken, "login");

    const tokenInfo = yield call(verifyToken, access_token || token);
    yield call(storeToken, token, tokenInfo.expires_in, "true");
    
    yield put(actions.handleLoginSuccess(token));

    return {
      access_token: access_token || token,
      expires_in: tokenInfo.expires_in
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
      yield call(delay, (token.expires_in - 900) * 1000);
    }
  } finally {
    if (yield cancelled()) {
      console.log("task cancelled");
    }
  }
}

function* authenticate() {
  let storedTokenInfo = yield call(getStoredToken);
  while (true) {
    if (!storedTokenInfo) {
      yield take(ON_LOGIN_ACTION);
    } else {
      yield put(actions.authStatusCheck(storedTokenInfo));
    }

    const authLoopTask = yield fork(authorizeLoop, storedTokenInfo);

    const { signOut } = yield race({
      signOut: yield take(ON_SIGN_OUT),
      authLoop: join(authLoopTask)
    });

    if (signOut) {
      storedTokenInfo = null;
      yield call(removeStoredToken);
      yield cancel(authLoopTask);
    }
  }
}

export function* requestAuthWatcher() {
  yield [takeLatest(ON_LOGIN_INIT, authenticate)];
}

export const actions = {
  handleLoginInit: payload => ({ type: ON_LOGIN_INIT, payload }),
  handleLoginAction: () => ({ type: ON_LOGIN_ACTION }),
  handleLoginSuccess: token => ({ type: ON_LOGIN_INIT_SUCCESS, token }),
  loginFailure: error => ({ type: ON_LOGIN_INIT_FAILURE, error }),
  handleSignOut: () => ({ type: ON_SIGN_OUT }),
  authStatusCheck: payload => ({ type: AUTH_STATUS_CHECK, payload })
};
