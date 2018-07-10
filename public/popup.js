/*eslint-disable no-undef*/

const login = document.getElementById('google_login');
const logout = document.getElementById('google_logout');

function getAllUrlParams(url) {

	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	var obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		var arr = queryString.split('&');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// in case params look like: list[]=thing1&list[]=thing2
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function (v) {
				paramNum = v.slice(1, -1);
				return '';
			});

			// set parameter value (use 'true' if empty)
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

			// (optional) keep case consistent
			paramName = paramName.toLowerCase();
			paramValue = paramValue.toLowerCase();

			// if parameter name already exists
			if (obj[paramName]) {
				// convert value to array (if still string)
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				// if no array index number specified...
				if (typeof paramNum === 'undefined') {
					// put the value on the end of the array
					obj[paramName].push(paramValue);
				}
				// if array index number specified...
				else {
					// put the value at that index number
					obj[paramName][paramNum] = paramValue;
				}
			}
			// if param name doesn't exist yet, set it
			else {
				obj[paramName] = paramValue;
			}
		}
	}

	return obj;
}

function init() {

var access_token;
var sheetId;

  login.addEventListener('click', function () {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      access_token = token;
      sheetId = '10FeqhDufQ698lx9vAywzB02cT_XTJU7_r7ugQAQMr9M';

      var header = new Headers();

      header.append('Content-Type', 'application/json');
      header.append('Authorization', `Bearer ${access_token}`);

      var getData = new Request(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0`, {
      		method: 'GET',
          headers: header
      });

      fetch(getData)
      .then(r => r.json())
      .then(r => console.log(r))
      .catch(e => console.log(e));

      console.log(access_token);

      const data = {
        "valueInputOption": "USER_ENTERED",
        "includeValuesInResponse": true,
        "responseValueRenderOption": "UNFORMATTED_VALUE",
        "data": [
          {
            "range": "Sheet1!A1",
            "majorDimension": "ROWS",
            "values": [
              ["name", "lastName", "date"],
              ["updated", "from", (new Date()).toISOString()],
              ["another", "field", (new Date()).toISOString()],
              [1, 2, "=SUM(A4:B4)"]
            ]
          }
        ]
      }

      var options = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data)
      }

      var insertData = new Request(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`, options);

      fetch(insertData)
      .then(r => r.json())
      .then(r => console.log(r))
      .catch(e => console.log(e));
    });
  });
  
  logout.addEventListener('click', function() {
        if (access_token) {
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${access_token}`)
          .then( () => {
            chrome.identity.removeCachedAuthToken(
              { 'token': access_token },  () => console.log('removed') )
            });
        }
  })

   
}

init();