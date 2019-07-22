
// Extracts a domain name from window.location.host
export const extractDomainName = (hostname) => {
	var host = hostname;
	host = host.replace(/^www\./i, "");
	host = host.replace(/(\.[a-z]{2,3})*\.[a-z]{2,3}$/i, "");
	return host;
}

export const getDataFrom = (array, marketplace) => {
    return array.filter(function(value) {
      return value.marketplace.includes(marketplace[0].id);
    });
}

export const getFromStorageSync = (key) => {
	return new Promise(function (resolve) {
		//eslint-disable-next-line no-undef
		browser.storage.sync.get(key).then(value => {
			resolve(value)
		})
	})
}

const parseHTML = string => {
	const context = document.implementation.createHTMLDocument();
	const base = context.createElement("base");
	base.href = document.location.href;
	context.head.appendChild(base);
	context.body.innerHTML = string;
	return context.body.children;
};

export const getItemCategory = async (url) => {
	return await fetch(url).then(r => r.text()).then(r => {
		const nodes = parseHTML(r)
		for (let node of nodes) {
			if (node.className === 'page') {
				const links = node.querySelectorAll('.breadcrumbs > a');
				if (links) {
					return Array.from(links).filter(v => v.pathname.startsWith('/category/'))[1].innerText
				}
			}
		}
	})
}