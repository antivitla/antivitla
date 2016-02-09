function eachSelector (rootElement, selector, callback) {
	var elements = Array.prototype.slice
		.call(rootElement.querySelectorAll(selector));
	if (matchSelector(rootElement, selector)) {
		elements.push(rootElement);
	}
	elements.forEach(function (element) {
		callback(element);
	});
}