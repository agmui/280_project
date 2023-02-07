function updateScroller() {
    var scrollerElements = document.querySelectorAll(".scroller");
    scrollerElements.forEach(element => {
        var elementTop = element.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;
        if (elementTop <= windowHeight) {
            element.classList.add("active");
        }
    });
}



function updateDownArrow() {
    var scrollerElements = document.querySelectorAll(".down-arrow");
    scrollerElements.forEach(element => {
        element.classList.add("active");
    });
}

function setupDownArrow() {
    var scrollerElements = document.querySelectorAll(".down-arrow");
    scrollerElements.forEach(element => {
        if (window.scrollY > 80 || window.innerHeight > 800) {
            element.style.display = "none";
          }
    });
}


let isOpen = true;
function updateMenu() {
    isOpen = !isOpen
    var mobileMenu = document.querySelector("#mobileMenu");
    if (isOpen) {
        mobileMenu.style.display = "block";
    } else {
        mobileMenu.style.display = "none";
    }
}

window.addEventListener("scroll", function () {
    updateScroller()
    updateDownArrow()
});

updateMenu()
setupDownArrow()
updateScroller()