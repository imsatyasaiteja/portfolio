// Cursor Animation :
const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    // Update the position of the custom cursor
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;
});

// Toggle Button :
let menutoggle = document.querySelector(".toggle");

menutoggle.onclick = function () {
    menutoggle.classList.toggle("active")
}
const navSlide = () => {
    const nav = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-list a");

    menutoggle.addEventListener("click", () => {
        nav.classList.toggle("nav-active");

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = "";
            }
            else {
                link.style.animation = 'navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s';
            }
        });
    });
};

navSlide();

// Fade out on Scroll :
$(window).scroll(function () {
    var scrollVar = $(window).scrollTop();
    $(".hero-box").css("opacity", 1 - scrollVar / 300);
})


