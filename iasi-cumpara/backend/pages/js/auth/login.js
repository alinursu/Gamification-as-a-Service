logBtn = () => {
    document.getElementById("logbtn").className = "toggle btn";
    document.getElementById("regbtn").className = "toggle";
    document.getElementById("log-form").style.display="block";
    document.getElementById("reg-form").style.display="none";

}

regBtn = () => {
    document.getElementById("logbtn").className = "toggle";
    document.getElementById("regbtn").className = "toggle btn";
    document.getElementById("reg-form").style.display="block";
    document.getElementById("log-form").style.display="none";
}

onSubmitLogin = () => {

    const email = document.getElementById("emailLog");
    const pass = document.getElementById("passLog");

    const payload = {
        email: email.value,
        password: pass.value
    };

}

onSubmitRegister = () => {
    const name = document.getElementById("nameReg");
    const email = document.getElementById("emailReg");
    const pass = document.getElementById("passReg");
    const confirmPass = document.getElementById("confirmReg");
    if(pass !== confirmPass) {
        alert('Parolele trebuie sa coincida!')
    }

    const payload = {
        name: name.value,
        email: email.value,
        password: pass.value
    };

    
}