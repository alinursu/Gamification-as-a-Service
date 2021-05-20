window.onscroll = function() {
    stickyHeaderFunction()
};

var headerObj = document.getElementById("header");
var sticky = headerObj.offsetTop;

function stickyHeaderFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky-header");
  } else {
    header.classList.remove("sticky-header");
  }
}