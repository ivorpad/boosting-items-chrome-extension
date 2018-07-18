
var rand = function (length) {
	return Math.random().toString(length).substr(2); // remove `0.`
};

var token = function (length) {
	return rand(length) + rand(length); // to make it longer
};

/*eslint-disable no-undef*/
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    switch(request.type) {
      case 'refresh':
        console.log('hey there')
        return true; 
      case 'login':
        console.log('prepare login');

        // Create a state token to prevent request forgery.
        // Store it in localStorage for later validation.
        localStorage.setItem('state', token(36));
        localStorage.setItem('nonce', token(36));
      
        var authURL = 'https://accounts.google.com/o/oauth2/v2/auth';
        var redirectURL = chrome.identity.getRedirectURL("oauth2");
        var auth_params = {
        	client_id: chrome.runtime.getManifest().oauth2.client_id,
        	redirect_uri: redirectURL,
          response_type: 'id_token token',
          access_type: 'online',
          //prompt: 'consent',
          // login_hint: 'ivor.padilla@envato.com',
          scope: 'https://www.googleapis.com/auth/spreadsheets profile email',
          state: localStorage.getItem('state'),
          nonce: localStorage.getItem('nonce')
        };

        var params = Object.keys(auth_params).map(function (k) {
        	return k + '=' + auth_params[k]
        }).join('&')

        authURL += '?' + params;

        chrome.identity.launchWebAuthFlow({ url: authURL, interactive: true }, function(responseURL) {
          
            console.log(responseURL)
            const paramsString = responseURL.substring(responseURL.indexOf('?') + 1);
            //var paramsString = url.substring(url.indexOf('?') + 1).replace('#', '');
            const paramsSearch = new URLSearchParams(paramsString);

            const paramsObj = (params) => {
            	const obj = {}
            	for (var entry of params.entries()) {
            		obj[entry[0]] = entry[1]
            	}
            	return obj;
            }

            if (paramsObj(paramsSearch)[`${redirectURL}#state`] !== window.localStorage.getItem('state')) {
              console.log(`Invalid state parameter`);
              return;
            }

            console.log(paramsObj(paramsSearch))

            const { access_token } = paramsObj(paramsSearch);

            chrome.storage.sync.set({access_token}, function() {
              sendResponse({
                access_token,
                isLoggedIn: true
              });
            })
        })
        // return true otherwise sendResponse() won't be async
        return true;
      case 'logout':
        console.log(request)
        console.log('then: prepare logout');

        chrome.storage.sync.get(['access_token'], function (result) {
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${result.access_token}`)
          localStorage.removeItem('state');
          localStorage.removeItem('nonce');
        });

        sendResponse({
          isLoggedOut: true
        });
        
        // return true otherwise sendResponse() won't be async
        return true;
        default:
        console.log('request wasn\'t found')
      break;
    }
  });


