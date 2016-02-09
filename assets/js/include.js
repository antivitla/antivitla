(function () {

	function performInclude (element) {
		var url = element.getAttribute("src"),
			req = new XMLHttpRequest();
		req.onreadystatechange = function () {
			if (this.readyState != 4) {
				return;
			}
			var template, clone, event, refs;
			template = document.createElement("template");
			template.innerHTML = this.response;
			if (template.content) {
				clone = document.importNode(template.content, true);
			} else {
				clone = template.cloneNode(true);
			}
			refs = Array.prototype.slice.call(clone.children);
			element.parentElement.insertBefore(clone, element);
			element.parentElement.removeChild(element);
			for (var i = 0; i < refs.length; i++) {
				triggerEvent(refs[i], "include");
			}
		}
		req.open("GET", url);
		req.send();
	}

	document.addEventListener("DOMContentLoaded", function () {
		eachSelector(document.querySelector("body"), "include[src]", function (element) {
			performInclude(element);
		});
	});

	document.addEventListener("include", function (event) {
		eachSelector(event.target, "include[src]", function (element) {
			performInclude(element);
		});
	});

}());