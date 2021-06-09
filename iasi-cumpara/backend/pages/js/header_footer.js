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

    console.log(authCookie)
}