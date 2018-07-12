/*eslint-disable no-undef*/

const login = document.getElementById('google_login');
const logout = document.getElementById('google_logout');



// function init() {

//   var sheetId;

  login.addEventListener('click', requestWithAuth);
  logout.addEventListener('click', removeAuth);

  function requestWithAuth() {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError); // return instead
      }

      console.log(token)

      chrome.storage.local.set({token}, function() {
        console.log('Value is set to ' + token);
      });
    });
  }

  function removeAuth() {

    chrome.storage.local.get(['token'], (result) => {
      removeToken(result.token);
    });

    function removeToken(token) {
      console.log('removing token: ' + token);
      if(token) {
        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
          .then(() => {
            chrome.identity.removeCachedAuthToken({
              'token': token
            }, function () {
              chrome.storage.local.remove(['token'], function(v) {
                console.log('Value is set to ' + v);
              });
          })
        });
      }
    }
      // end
  }
   



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