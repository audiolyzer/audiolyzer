var loadTextResource = function(url, callback) {
	fetch(url).then(response => {
		return response.text();
	}).then(data => {
		callback(data);
	}).catch(error => {
		console.error("Failed to fetch file: ", error);
	});
};

var loadJSONResource = function(url, callback) {
	loadTextResource(url, function(data) {
		callback(JSON.parse(data));
	});
};