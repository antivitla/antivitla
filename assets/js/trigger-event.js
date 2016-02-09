function triggerEvent (element, type, options) {
	options = options || { bubbles: true, cancelable: true };
	var event;
	if (navigator.userAgent.match(/Trident/)) {
		event = document.createEvent("CustomEvent");
		event.initEvent(type, options.bubbles, options.cancelable, options.detail);
	} else {
		event = new CustomEvent(type, options);
	}
	element.dispatchEvent(event);
}