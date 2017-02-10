document.addEventListener("DOMContentLoaded", function () {
  var elements = document.querySelectorAll(".hidden-reality-reveal");
  elements.forEach(function (element) {
    element.addEventListener("click", function () {
      document.querySelector("body").classList.toggle("hidden-reality-revealed");
    });
  });
});