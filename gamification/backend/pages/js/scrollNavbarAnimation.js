var servicesDivBottom = document.getElementById('services-div').offsetTop;
var documentationDivBottom = document.getElementById('documentation-div').offsetTop;
var contactDivBottom = document.getElementById('contact-div').offsetTop;

document.addEventListener('scroll' , function() {
    var navbarButtons = document.getElementsByClassName('navbar-button')
    var navbarButtonsClickable = document.getElementsByClassName('navbar-clickable-button');
    var windowOffset = Math.round(window.pageYOffset);
    

    if(windowOffset <= servicesDivBottom) {
        if(!navbarButtons[0].className.includes(' selected-navbar-button')) {
            navbarButtons[0].className = 'navbar-button selected-navbar-button';
            navbarButtonsClickable[0].className = 'navbar-clickable-button navbar-selected-clickable-button';
        }
    }
    else {
        if(navbarButtons[0].className.includes(' selected-navbar-button')) {
            navbarButtons[0].className = 'navbar-button';
            navbarButtonsClickable[0].className = 'navbar-clickable-button';
        }
    }

    if(windowOffset > servicesDivBottom && windowOffset <= documentationDivBottom) {
        if(!navbarButtons[1].className.includes(' selected-navbar-button')) {
            navbarButtons[1].className = 'navbar-button selected-navbar-button';
            navbarButtonsClickable[1].className = 'navbar-clickable-button navbar-selected-clickable-button';
        }
    }
    else {
        if(navbarButtons[1].className.includes(' selected-navbar-button')) {
            navbarButtons[1].className = 'navbar-button';
            navbarButtonsClickable[1].className = 'navbar-clickable-button';
        }
    }

    if(windowOffset > documentationDivBottom && windowOffset <= contactDivBottom) {
        if(!navbarButtons[2].className.includes(' selected-navbar-button')) {
            navbarButtons[2].className = 'navbar-button selected-navbar-button';
            navbarButtonsClickable[2].className = 'navbar-clickable-button navbar-selected-clickable-button';
        }
    }
    else {
        if(navbarButtons[2].className.includes(' selected-navbar-button')) {
            navbarButtons[2].className = 'navbar-button';
            navbarButtonsClickable[2].className = 'navbar-clickable-button';
        }
    }
});