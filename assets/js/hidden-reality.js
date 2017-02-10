document.addEventListener("DOMContentLoaded", function () {
  var elements = document.querySelectorAll(".hidden-reality-reveal");
  elements.forEach(function (element) {
    element.style.cursor = "pointer";
    element.addEventListener("click", function () {
      document.querySelector("body").classList.toggle("hidden-reality-revealed");
    });
  });
});