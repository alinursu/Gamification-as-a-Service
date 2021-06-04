logBtn = () => {
    document.getElementById("logbtn").className = "toggle btn"
    document.getElementById("regbtn").className = "toggle"
    document.getElementById("log-form").style.display="block"
    document.getElementById("reg-form").style.display="none"

}

regBtn = () => {
    document.getElementById("logbtn").className = "toggle"
    document.getElementById("regbtn").className = "toggle btn"
    document.getElementById("reg-form").style.display="block"
    document.getElementById("log-form").style.display="none"
}