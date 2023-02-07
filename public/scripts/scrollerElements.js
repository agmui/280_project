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

window.addEventListener("scroll", function () {
    update()
});
update()