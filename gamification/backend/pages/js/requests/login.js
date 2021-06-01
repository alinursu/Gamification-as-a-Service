//TODO: exemplu de XMLHttpRequest (Ajax)

// const loginForm = document.getElementById('login-form');
//
// loginForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const formData = new FormData(loginForm);
//
//     const xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "/login");
//     xhttp.onreadystatechange = function() {
//         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//             console.log(this.responseText);
//         }else {
//             console.log(this.responseText)
//         }
//     };
//
//     xhttp.send(`email=${formData.get('email')}&password=${formData.get('password')}&rememberChckBox=${formData.get('rememberChckBox')}`);
// })