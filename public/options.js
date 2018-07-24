/* eslint-disable no-undef */

// Saves options to chrome.storage
function save_options() {
	var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  var sheetIdValue = document.getElementById('sheet_id').value;

	chrome.storage.sync.set({
		favoriteColor: color,
    likesColor: likesColor,
    sheetIdValue: sheetIdValue
	}, function () {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function () {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		favoriteColor: 'red',
    likesColor: true,
    sheetIdValue: 'some default'
	}, function (items) {
    console.log(items)
		document.getElementById('color').value = items.favoriteColor;
		document.getElementById('like').checked = items.likesColor;
		document.getElementById('sheet_id').value = items.sheetIdValue;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
	save_options);