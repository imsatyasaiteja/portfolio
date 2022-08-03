// Navigation bar : 

window.onscroll = function() {myFunction()};
function myFunction() 
{
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
  document.getElementById("box_1").style.translate = scrolled + "%";
}

// Fade out on Scroll :
$(window).scroll(function () {
  var scrollVar = $(window).scrollTop();
  $(".section_1").css("opacity", 1 - scrollVar / 300);
})
