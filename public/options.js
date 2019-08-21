/* eslint-disable no-undef */

document.querySelector(".description").children[0].href = chrome.extension.getURL('/img/sheetId.png');

// Saves options to browser.storage
function save_options() {
  let sheetIdValue = document.getElementById('sheet_id').value;
	let baseUrlValue = document.getElementById('base_url').value;
	const debugModeValue = document.getElementById("debug_mode").checked;

	baseUrlValue = baseUrlValue
    .replace(/(^\w+:|^)\/\//, "")
    .replace(/\/+$/, "");

	sheetIdValue = sheetIdValue.trim();	

	browser.storage.sync.set({ sheetIdValue, baseUrlValue, debugModeValue }).then( () => {
		var status = document.getElementById('status');
		status.textContent = 'Options saved...';
		setTimeout(function () {
			status.textContent = '';
		}, 750);
	})

}

// Restores select box and checkbox state using the preferences
// stored in browser.storage.
function restore_options() {
	browser.storage.sync.get({ sheetIdValue: '', baseUrlValue: '', debugModeValue: ''}).then( (items) => {
		console.log(items);
		document.getElementById('sheet_id').value = items.sheetIdValue;
		document.getElementById("base_url").value = items.baseUrlValue;
		document.getElementById("debug_mode").checked = items.debugModeValue;

	})
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
	save_options);