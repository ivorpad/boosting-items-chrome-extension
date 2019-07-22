/* eslint-disable no-undef */

document.querySelector(".description").children[0].href = chrome.extension.getURL('/img/sheetId.png');

// Saves options to chrome.storage
function save_options() {
  const sheetIdValue = document.getElementById('sheet_id').value;
  const baseUrlValue = document.getElementById('base_url').value;

	browser.storage.sync.set({
	sheetIdValue: sheetIdValue,
	baseUrlValue: baseUrlValue
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
	browser.storage.sync.get({
	sheetIdValue: '',
	baseUrlValue: ''
	}, function (items) {
    console.log(items)
		document.getElementById('sheet_id').value = items.sheetIdValue;
		document.getElementById("base_url").value = items.baseUrlValue;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
	save_options);