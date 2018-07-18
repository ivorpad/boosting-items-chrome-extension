/*eslint-disable no-undef*/



  function oauthSignIn() {
  	// Google's OAuth 2.0 endpoint for requesting an access token
  	var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  	// Create <form> element to submit parameters to OAuth 2.0 endpoint.
  	var form = document.createElement('form');
  	form.setAttribute('method', 'GET'); // Send as a GET request.
  	form.setAttribute('action', oauth2Endpoint);

  	// Parameters to pass to OAuth 2.0 endpoint.
  	var params = {
  		'client_id': '345564432721-bheknq9uhhaghq7jlhok2esgje7qk5o3.apps.googleusercontent.com',
  		'redirect_uri': 'http://localhost',
  		'response_type': 'token',
  		'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
  		'include_granted_scopes': 'true',
  		'state': 'pass-through value'
  	};

  // Add form parameters as hidden input values.
  for (var p in params) {
  	var input = document.createElement('input');
  	input.setAttribute('type', 'hidden');
  	input.setAttribute('name', p);
  	input.setAttribute('value', params[p]);
  	form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
  console.log('asa')
  }
  //oauthSignIn()
  const login = document.getElementById('google_login');

  login.addEventListener('click', oauthSignIn)


  // login.addEventListener('click', function () {

  //   chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  //     access_token = token;

  //     console.log(access_token);

  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, { access_token }, function(response) {
  //     console.log(response);
  //   });
  // });
  
  // sheetId = '10FeqhDufQ698lx9vAywzB02cT_XTJU7_r7ugQAQMr9M';

  // var header = new Headers();

  // header.append('Content-Type', 'application/json');
  // header.append('Authorization', `Bearer ${access_token}`);

  // var getData = new Request(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0`, {
  // 		method: 'GET',
  //     headers: header
  // });

  // fetch(getData)
  // .then(r => r.json())
  // .then(r => console.log(r))
  // .catch(e => console.log(e));

  /** 
   * Batch Update
   */
  // const data = {
  //   "valueInputOption": "USER_ENTERED",
  //   "includeValuesInResponse": true,
  //   "responseValueRenderOption": "UNFORMATTED_VALUE",
  //   "data": [
  //     {
  //       "range": "Sheet1!A1",
  //       "majorDimension": "ROWS",
  //       "values": [
  //         ["name", "lastName", "date"],
  //         ["updated", "from", (new Date()).toISOString()],
  //         ["another", "field", (new Date()).toISOString()],
  //         [1, 2, "=SUM(A4:B4)"]
  //       ]
  //     }
  //   ]
  // }

  // const range = "Sheet1!A2";

  /**
   * Append
   */
  //   const data = {
  //     "range": range,
  //     "majorDimension": "ROWS",
  //     "values": [
  //       ["data", "inserted", "dynamically"],
  //       ["with", "a date", (new Date()).toISOString()],
  //       ["another", "field with date", (new Date()).toISOString()],
  //     ]
  //   }

  //   var options = {
  //     method: 'POST',
  //     headers: header,
  //     body: JSON.stringify(data)
  //   }

  //   var insertData = new Request(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, options);

  //   fetch(insertData)
  //   .then(r => r.json())
  //   .then(r => console.log(r))
  //   .catch(e => console.log(e));
  //   });
  // });
  
  //   logout.addEventListener('click', function() {
  //         console.log(access_token + ' defined?')
  //         if (access_token) {
  //           localStorage.removeItem('access_token');
  //           console.log('lS removed')
  //           fetch(`https://accounts.google.com/o/oauth2/revoke?token=${access_token}`)
  //           .then( () => {
  //             chrome.identity.removeCachedAuthToken(
  //               { 'token': access_token },  function() {
  //                 console.log('removed2')
  //               })
  //             });
  //         }
  //   });
  // }

// init();