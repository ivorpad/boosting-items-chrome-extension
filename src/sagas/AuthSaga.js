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

function verifyToken(access_token) {
  /* eslint-disable no-undef */
  return new Promise(resolve => {
    const sending = browser.runtime.sendMessage({
      type: "fetchTokenInfo",
      access_token
    });

    sending.then(data => {
      resolve(data);
    });
  });
}

const requestAuthToken = type => {
  return new Promise((resolve, reject) => {
    const sending = browser.runtime.sendMessage({ type });
    sending.then(response => {
      if (response.access_token) {
        resolve(response);
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
  localStorage.removeItem("submitInfo");
};

function* authorize(storedToken) {
  try {
    let access_token, expires_in, results;

    if (!storedToken) {
      let data = yield call(requestAuthToken, "login");
      access_token = data.access_token;
      if (access_token) {
        results = yield call(verifyToken, access_token);
        expires_in = results.expires_in;
        yield call(storeToken, access_token, expires_in, "true");
      }
    } else {
      ({ access_token, expires_in } = yield call(verify, storedToken));
    }

    yield put(actions.handleLoginSuccess(access_token));

    return {
      access_token,
      expires_in
    };
  } catch (error) {
    yield call(removeStoredToken);
    yield put(actions.loginFailure(error));
  }
}

function* verify(storedToken) {
  let access_token, expires_in;
  ({ access_token, expires_in } = JSON.parse(storedToken));

  let results = yield call(verifyToken, access_token);

  if ((results.error && storedToken !== null) || results.expires_in <= 900) {
    const data = yield call(requestAuthToken, "refresh");
    yield call(storeToken, data.access_token, data.expires_in, data.isLoggedIn);
    access_token = data.access_token;
    expires_in = data.expires_in;
  } else {
    browser.storage.sync.get("debugModeValue").then(({ debugModeValue }) => {
      if (debugModeValue) {
        console.log(`Refresh not necessary.`);
      }
    });
  }

  return {
    access_token,
    expires_in
  };
}

function* authorizeLoop(token) {
  try {
    while (true) {
      const refresh = token != null;
      let access_token;
      if (refresh) {
        access_token = yield call(verify, token);
      } else {
        access_token = yield call(authorize, token);
        return;
      }

      // const fiveSeconds = 5000; just for testing
      const fortyFiveMinutes = (access_token.expires_in - 900) * 1000;
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
    yield call(verify, storedTokenInfo);
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
