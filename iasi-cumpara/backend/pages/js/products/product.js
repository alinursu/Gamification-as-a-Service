/* Slideshow */
var actualSlide = 1;
var slides = document.getElementsByClassName("slide");
var dots = document.getElementsByClassName("slideshow-dot");

function showNextSlide() 
{
    actualSlide = actualSlide + 1;
    if(actualSlide > slides.length)
        actualSlide = 1;
    showSlide(actualSlide);
}

function showPreviousSlide() 
{
    actualSlide = actualSlide - 1;
    if(actualSlide <= 0)
        actualSlide = slides.length;
    showSlide(actualSlide);
}

function showSelectedSlide(n) 
{
    actualSlide = n + 1;
    showSlide(actualSlide);
}

function showSlide(n)
{
    var i;
    for (i = 0; i < slides.length; i++) 
        slides[i].style.display = "none";

    for (i = 0; i < dots.length; i++)
        dots[i].className = dots[i].className.replace(" active", "");
    
    slides[actualSlide-1].style.display = "block";  
    dots[actualSlide-1].className += " active";
}


/* Phone number */
var phoneNumberShown = false;
function showPhoneNumber(phoneNumber)
{
    if(phoneNumberShown === false)
    {
        document.getElementsByClassName("phone-number-p")[0].innerHTML = phoneNumber;
        phoneNumberShown = true;
    }
    else
    {
        document.getElementsByClassName("phone-number-p")[0].innerHTML = "0XXX XXX XXX";
        phoneNumberShown = false;
    }
}

showSlide(actualSlide);

changeQuantity = (ops) => {
    if(ops === 'add' && document.getElementById('quantity').value < 10) {
        document.getElementById('quantity').value ++
    } else if(ops === 'take' && document.getElementById('quantity').value > 1) {
        document.getElementById('quantity').value --
    }
}

buyProduct = () => {
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('authTokenISC'))
    if(!authCookie) {
        location.href = '/login';
    }
}