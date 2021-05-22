var auxSidenav = document.getElementById('sidenav');
var auxBurgermenu = document.getElementById('burgermenu');

function openBurgermenu() {
    var sidenav = document.getElementById("sidenav");

    sidenav.style.display = "flex";
    sidenav.style.flexWrap = "wrap";
    sidenav.style.flexDirection = "column";
    sidenav.style.marginLeft = "auto";
    sidenav.style.width = "fit-content";
    sidenav.style.backgroundColor = "#423788";
    sidenav.style.boxShadow = "2px 2px 4px #000000";
    sidenav.style.borderRadius = "5px";


    document.getElementById("burgermenu").style.display = "none";
}

function closeBurgermenu() {
    document.getElementById("sidenav").style = auxSidenav.style;
    document.getElementById("burgermenu").style = auxBurgermenu.style;
}