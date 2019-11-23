// Ajax
function xhrRequest(req) {
	let xhr = new XMLHttpRequest();
	xhr.open((req.method ? req.method : 'GET'), req.url, req.async);
	xhr.onload = function () {
		req.res = JSON.parse(xhr.response);
		if (xhr.status === 200) {
			if (req.success) {
				req.success(JSON.parse(xhr.response));
			}
		} else {
			if (req.error) {
				req.error(JSON.parse(xhr.response));
			}
		}
	};
	if (req.data) {
		xhr.setRequestHeader('X-CSRF-Token', document.getElementsByTagName('meta')['csrf-token'].content);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify(req.data));
	} else {
		xhr.send();
	}
}

export function getVariables(url) {
	let getVariablesReq = {
		url: url,
		method: 'GET',
		async: false
	};
	xhrRequest(getVariablesReq);
	return getVariablesReq.res;
}
