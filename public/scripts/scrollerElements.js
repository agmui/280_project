function update() {
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

window.addEventListener("scroll", function () {
    update()
    updateDownArrow()
});
update()