// /*eslint-disable no-undef*/
// chrome.runtime.onMessage.addListener(
// 	function (request, sender, sendResponse) {

//     localStorage.setItem('access_token', request.access_token);

// 		console.log(sender.tab ?
// 			"from a content script:" + sender.tab.url :
// 			"from the extension access_token: " + request.access_token);
// 		if (request.access_token)
// 			sendResponse({
// 				farewell: "goodbye"
// 			});
// 	});
// 	/* eslint-enable-rule no-undef */