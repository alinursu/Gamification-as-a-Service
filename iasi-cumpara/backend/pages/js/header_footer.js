const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const name = searchInput.value;
        window.location.href = "/search?name=" + name;
    })
}

openSideNav = () => {
    document.getElementById("sidenav").style.width = "fit-content"
    document.getElementById("sidenav").style.position = "fixed"
    document.getElementById("burgermenu").style.display = "none"
    document.getElementsByTagName('body')[0].style.backgroundColor = "rgba(0,0,0,0.5)"
    document.getElementById("imghead").style.filter = "brightness(50%)"
    document.getElementsByTagName('footer')[0].style.filter = "brightness(50%)"
}
closeSideNav = () => {
    document.getElementById("sidenav").style.width = "0px"
    document.getElementById("burgermenu").style.display = "flex"
    document.getElementsByTagName('body')[0].style.backgroundColor = "transparent"
    document.getElementById("imghead").style.filter = "brightness(100%)"
    document.getElementsByTagName('footer')[0].style.filter = "brightness(100%)"
}

scrollToTop = () => {
    document.getElementsByClassName('head')[0].scrollIntoView({behavior: 'smooth'});
    document.getElementsByClassName('mobileMenu')[0].scrollIntoView({behavior: 'smooth'});

}

checkProfileRoute = () => {
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('authTokenISC'))

    location.href = authCookie ? '/profile' : '/login'
}


const btn = document.getElementsByClassName("auth-btn");
// check login state
const authCookie = document.cookie.split('; ').find(row => row.startsWith('authTokenISC'))
if (authCookie) {
    for (let i =0; i<btn.length;i++) {
        const button = btn[i];
        button.innerHTML = "Deconectare";
        button.addEventListener('click', (event) => {
            document.cookie = "authTokenISC=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            location.href = '/';
        })
    }
} else {
    for (let i =0; i<btn.length;i++) {
        const button = btn[i];
        button.addEventListener('click', (event) => {
            location.href = "/login";
        })
    }
}



