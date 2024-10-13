var loadTextResource = function(url, callback) {
	var iframe = document.createElement('iframe');
	iframe.id = url;
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
	iframe.src = './'+url;
	iframe.onload = function() {
		var text = document.getElementById(url).contentDocument.body.firstChild.innerText;
		callback(text);
	};
}

var loadJSONResource = function(url, callback) {
	loadTextResource(url, function(data) {
		callback(JSON.parse(data));
	});
};