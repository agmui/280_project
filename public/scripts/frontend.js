function updateScroller() {
    var scrollerElements = document.querySelectorAll(".scroller");
    scrollerElements.forEach(element => {
        var elementTop = element.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;
        // console.log(`The element top: ${elementTop} The window height: ${windowHeight}`);
        if ((elementTop-windowHeight) <= windowHeight - 350) {
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
let profile =""
function showMembers(people) {
    people.map((person, index) => {
        profile = `<li key=${person.lastname} class="w-12 h-12 rounded-full overflow-hidden filter
        ${index !== person.member ? "saturate-0 hover:brightness-125" : "saturate-100"}">
            <button class="w-full h-full" onClick={() => setMember(index)}>
                <img src=${person.picture} alt="" class="object-cover" />
            </button>
        </li>`
        document.getElementById("firstname").innerHTML = person.firstname
        document.getElementById("lastname").innerHTML = person.lastname
        document.getElementById("displayMembers").insertAdjacentHTML('beforeend',profile)
    })
}
const people = [
    {
      firstname: "Tonyo",
      lastname: "Delapena",
      role: "Boss",
      picture: "https://fancytailwind.com/static/profile8-34d5f5980ca5030c155a2ffbb50b5802.jpg",
      description: "Harum iusto exercitationem assumenda quas nostrum perspiciatis quos iste sit reprehenderit, libero quae aperiam sapiente delectus, porro tempore minus repellendus ratione distinctio!",
      facebookURL: "#link",
      twitterURL: "#link",
      linkedinURL: "#link",
      youtubeURL: "#link",
      member: true
    },
    {
      firstname: "Laetitia",
      lastname: "Librals",
      role: "Designer",
      picture: "https://fancytailwind.com/static/profile14-e9ac6c7d68a78a1cbbf29458acacc95a.jpg",
      description: "Harum iusto exercitationem assumenda quas nostrum perspiciatis quos iste sit reprehenderit, libero quae aperiam sapiente delectus, porro tempore minus repellendus ratione distinctio!",
      facebookURL: "#link",
      twitterURL: "#link",
      linkedinURL: "#link",
      youtubeURL: "#link",
      member: true
    },
    {
      firstname: "Laetitia",
      lastname: "Librals",
      role: "Designer",
      picture: "https://fancytailwind.com/static/profile14-e9ac6c7d68a78a1cbbf29458acacc95a.jpg",
      description: "Harum iusto exercitationem assumenda quas nostrum perspiciatis quos iste sit reprehenderit, libero quae aperiam sapiente delectus, porro tempore minus repellendus ratione distinctio!",
      facebookURL: "#link",
      twitterURL: "#link",
      linkedinURL: "#link",
      youtubeURL: "#link",
      member: true
    }
]
if (true){// TODO: check if it is on aboutUs page
    showMembers(people)
}