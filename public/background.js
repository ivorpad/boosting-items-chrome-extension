var rand = function (length) {
  return Math.random()
    .toString(length)
    .substr(2);
};

var token = function (length) {
  return rand(length) + rand(length);
};

const convertParamsToString = params => {
  return Object.keys(params)
    .map(function (k) {
      return k + "=" + params[k];
    })
    .join("&");
};

const paramsObj = params => {
  const obj = {};
  for (var entry of params.entries()) {
    obj[entry[0]] = entry[1];
  }
  return obj;
};

function Token() {
  /* eslint-disable no-undef */
  const authUri = "https://accounts.google.com/o/oauth2/v2/auth";

  const redirectURL = chrome.identity.getRedirectURL("oauth2");

  const auth_global_params = {
    client_id: chrome.runtime.getManifest().oauth2.client_id,
    redirect_uri: redirectURL,
    response_type: "id_token token code",
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/spreadsheets profile email"
  };

  let login_hint, paramsString, paramsSearch, launchWebAuthFlowParams;

  /**
   * Gets a new interactive access token to access Google APIs
   *
   * @param  {bool} interactive
   * @param  {bool} prompt
   * @param  {func} callback
   * @return {void}
   */

  function getNewToken(prompt = true) {
    // Create a state token to prevent request forgery.
    // Store it in localStorage for later validation.
    localStorage.setItem("state", token(36));
    localStorage.setItem("nonce", token(36));

    return new Promise(function (resolve, reject) {
      let get_new_token_params = {
        ...auth_global_params,
        state: localStorage.getItem("state"),
        nonce: localStorage.getItem("nonce")
      };

      login_hint = localStorage.getItem("login_hint");

      // if login_hint is defined then we see the login_hint parameter
      if (login_hint) get_new_token_params["login_hint"] = login_hint;
      if (prompt) get_new_token_params["prompt"] = "select_account consent";

      launchWebAuthFlowParams = convertParamsToString(get_new_token_params);

      chrome.identity.launchWebAuthFlow(
        {
          url: authUri.concat(`?${launchWebAuthFlowParams}`),
          interactive: true
        },
        function (redirectUri) {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
            return;
          }

          paramsString = redirectUri.substring(redirectUri.indexOf("?") + 1);
          paramsSearch = new URLSearchParams(paramsString);

          if (
            paramsObj(paramsSearch)[`${redirectURL}#state`] !==
            localStorage.getItem("state")
          ) {
            console.log(`Invalid state parameter`);
            return;
          }

          const { access_token, code } = paramsObj(paramsSearch);

          getRefreshToken(code);

          tokenInfo(access_token).then(resp => {
            localStorage.setItem("login_hint", resp.email);
          });

          resolve(access_token);
        }
      );
    });
  }

  /**
   * Returns an object with the information about the access token (email, expiration time, etc).
   *
   * @param {string} token
   * @return {obj}
   */
  async function tokenInfo(token) {
    const token_info = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );
    return token_info.json();
  }

  return {
    getNewToken,
    tokenInfo
  };
  /* eslint-enable no-undef */
}

/**
 * Retrieve a refresh token to be used to get a new access token.
 *
 * @param {string} code
 * @return {string} refresh_token
 */
async function getRefreshToken(code) {
  /* eslint-disable no-undef */

  const refresh_params = {
    code,
    grant_type: "authorization_code",
    client_id: chrome.runtime.getManifest().oauth2.client_id,
    client_secret: "_NYuIDvR2PoiM3mFSh1QShow",
    redirect_uri: chrome.identity.getRedirectURL("oauth2")
  };

  const res = await fetch(`https://www.googleapis.com/oauth2/v4/token`, {
    method: "post",
    body: JSON.stringify(refresh_params)
  }).then(r => r.json());

  const { refresh_token } = res;

  localStorage.setItem("boosting_ext_refresh_token", refresh_token);

  return refresh_token;
}

async function getAccessTokenWithRefreshToken() {
  const refresh_token = localStorage.getItem("boosting_ext_refresh_token");

  if (refresh_token) {
    const access_token_params = {
      refresh_token,
      client_id: chrome.runtime.getManifest().oauth2.client_id,
      client_secret: "_NYuIDvR2PoiM3mFSh1QShow",
      grant_type: "refresh_token"
    };

    return await fetch(`https://www.googleapis.com/oauth2/v4/token`, {
      method: "post",
      body: JSON.stringify(access_token_params)
    })
      .then(r => r.json())
      .then(results => {
        const { access_token, expires_in } = results;
        return new Promise(resolve => {
          resolve({
            access_token,
            expires_in
          });
        });
      });
  }
}

const TokenFactory = new Token();

/*eslint-disable no-undef*/

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "login":
      console.log("prepare login");

      TokenFactory.getNewToken(true)
        .then(access_token => {
          browser.storage.sync.set({
            access_token
          });

          sendResponse({
            access_token,
            isLoggedIn: true
          });
        })
        .catch(error => {
          sendResponse({
            error
          });
          //throw new Error(e)
        });

      return true;
    case "refresh":
      console.log(`background refresh — ${new Date().toLocaleString()}`);

      getAccessTokenWithRefreshToken().then(({ access_token, expires_in }) => {
        sendResponse({
          access_token,
          expires_in,
          isLoggedIn: true
        });
      });

      return true;
    case "logout":
      console.log("prepare logout");

      browser.storage.sync.get("access_token").then(({ access_token }) => {
        if (access_token) {
          fetch(
            `https://accounts.google.com/o/oauth2/revoke?token=${access_token}`
          )
            .then(r => {
              browser.storage.sync.remove("access_token").then(() => {
                localStorage.removeItem("state");
                localStorage.removeItem("nonce");
                localStorage.removeItem("start_token_refresh");
                localStorage.removeItem("boosting_ext_refresh_token");
                sendResponse({
                  access_token: null,
                  isLoggedIn: false
                });
              });
            })
            .catch(err => console.log(err));
        }
      });

      // return true otherwise sendResponse() won't be async
      return true;
    case "fetchTokenInfo":
      (async () => {
        let tokenInfo = fetch(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${request.access_token}`
        );

        tokenInfo
          .then(response => {
            if (!response.ok) {
              throw new Error(`Something went wrong with the request.`);
            }
            return response.json();
          })
          .then(({ expires_in }) => {
            sendResponse({ expires_in });
          })
          .catch(err => {
            sendResponse({ error: err.message });
          });
        return true;
      })();

      return true;
    case "fetchApiData":
      (async () => {
        let { baseUrl, endpoint, marketplace } = request;

        let url = `https://${baseUrl.baseUrlValue}/wp-json/wp/v2/${endpoint}?filter[marketplace]=${marketplace}`;
        let response = await fetch(url);
        response.json().then(r => sendResponse(r));
      })();

      return true;

    case "postApiData":
      (async () => {
        let response = await fetch(
          `${request.baseUrl}/${request.sheetId}/values/${request.range}:append?valueInputOption=USER_ENTERED`,
          {
            method: "post",
            headers: {
              Authorization: `Bearer ${request.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(request.payload)
          }
        );

        if (response.ok) {
          response.json().then(r => sendResponse({ success: true }));
        }
      })();

      return true;
    default:
      console.log("request wasn't found");
      break;
  }
});
