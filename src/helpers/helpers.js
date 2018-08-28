
// Extracts a domain name from window.location.host
export const extractDomainName = (hostname) => {
	var host = hostname;
	host = host.replace(/^www\./i, "");
	host = host.replace(/(\.[a-z]{2,3})*\.[a-z]{2,3}$/i, "");
	return host;
}

export const removeItemBundleCount = () => {
	Array.from(document.querySelectorAll('.e-form__label')).filter(function (v, i) {
		return v.innerText === 'Item Bundle Count';
	})[0].parentNode.remove();
}

export const getDataFrom = (array, marketplace) => {
    return array.filter(function(value) {
      return value.marketplace.includes(marketplace[0].id);
    });
}

export const getFromStorageSync = (key) => {
	return new Promise(function (resolve) {
		//eslint-disable-next-line no-undef
		chrome.storage.sync.get(key, function (items) {
			resolve(items)
		})
	})
}