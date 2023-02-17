function updateScroller() {
    var scrollerElements = document.querySelectorAll(".scroller");
    scrollerElements.forEach(element => {
        var elementTop = element.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;
        // //console.log(`The element top: ${elementTop} The window height: ${windowHeight}`);
        if ((elementTop - windowHeight) <= windowHeight - 350) {
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

//console.log('window.location.pathname :>> ', window.location.pathname);
if (window.location.pathname == '/competition.html') {
    setupDownArrow()
    updateScroller()
}

let isForm = {
    login: true,
    register: false,
    forgotPW: false
}
const getPosition = () => {
    return isForm.login ? "top-full"
        : isForm.register ? "top-0"
            : isForm.forgotPW ? "-top-full"
                : null
}
function setIsForm(update) {
    isForm = update
    loginStuff()
}

function multiReplace(elm, cond) {
    if (cond) {
        elm.classList.remove('text-white')
        elm.classList.add(...["bg-white", "bg-opacity-90", "text-gray-800"])
    } else {
        elm.classList.remove(...["bg-white", "bg-opacity-90", "text-gray-800"])
        elm.classList.add('text-white')
    }
}
function toggleWithBool(elm, cond) {
    cond ? elm.classList.add('opacity-0') : elm.classList.remove('opacity-0')
}

function loginStuff() {

    multiReplace(document.getElementById('loginBtn'), isForm.login)
    multiReplace(document.getElementById('registrationBtn'), isForm.register)
    multiReplace(document.getElementById('forgotPasswordBtn'), isForm.forgotPW)

    var lastClass = $('#displayFormContainer').attr('class').split(' ').pop();
    document.getElementById('displayFormContainer').classList.replace(lastClass, getPosition())

    toggleWithBool(document.getElementById('loginForm'), !isForm.login)
    toggleWithBool(document.getElementById('registerForm'), !isForm.register)
    toggleWithBool(document.getElementById('forgotPasswordForm'), !isForm.forgotPW)
}
function initPage() {
    if (window.location.search == '?signin=true') {
        isForm = { login: false, register: true, forgotPW: false }
        var lastClass = $('#displayFormContainer').attr('class').split(' ').pop();
        document.getElementById('displayFormContainer').classList.replace(lastClass, getPosition())
    }else if (window.location.search == '?resetPW=true') {
        isForm = { login: false, register: false, forgotPW: true }
        var lastClass = $('#displayFormContainer').attr('class').split(' ').pop();
        document.getElementById('displayFormContainer').classList.replace(lastClass, getPosition())
    }
    document.getElementById("loginBtn").className += " " + (isForm.login ? "bg-white bg-opacity-90 text-gray-800" : "text-white")
    document.getElementById("registrationBtn").className += " " + (isForm.register ? "bg-white bg-opacity-90 text-gray-800" : "text-white")
    document.getElementById("forgotPasswordBtn").className += " " + (isForm.forgotPW ? "bg-white bg-opacity-90 text-gray-800" : "text-white")
    toggleWithBool(document.getElementById('loginForm'), !isForm.login)
    toggleWithBool(document.getElementById('registerForm'), !isForm.register)
    toggleWithBool(document.getElementById('forgotPasswordForm'), !isForm.forgotPW)
}

updateMenu()
if (window.location.pathname == '/login.html')
    initPage()