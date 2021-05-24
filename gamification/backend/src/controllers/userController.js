const { parse } = require('querystring');

const UserModel = require('../models/User');
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');
const errorRoute = require('../routes/error');

/**
 * Rezolva un request de tip POST facut in pagina /login.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleLoginRequest(request, response) {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Creez modelul
        let user = new UserModel(null, null, null, parsedBody.email, parsedBody.password, null);

        // Verific datele
        if(user.email == null || user.password == null){
            request.statusCode = 400;
            request.statusCodeMessage = "Bad Request";
            request.errorMessage = "Request-ul de tip POST primit la pagina /login nu este unul valid!";
            return errorRoute(request, response);
        }

        if(user.email.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Campul adresei de email nu poate fi gol!";
            return loginRoute(request, response);
        }

        if(user.password.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Campul parolei nu poate fi gol!";
            request.previousEmailValue = user.email;
            return loginRoute(request, response);
        }

        if(!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(user.email)) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Adresa de email nu este valida!";
            request.previousEmailValue = user.email;
            return loginRoute(request, response);
        }

        // Verific daca modelul apare in baza de date 
                        // TODO: daca da, select + transfer in cookie a id-ului sau ceva
                                                                                            // TODO

        // TODO: Create appropiate response
        response.end('ok');

        // TODO: Create cookie to mentain client logged in
    });    
}

/**
 * Rezolva un request de tip POST facut in pagina /register.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
 function handleRegisterRequest(request, response) {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Creez modelul
        let user = new UserModel(null, parsedBody.lastname, parsedBody.firstname,
            parsedBody.email, parsedBody.password, parsedBody.weburl);

        // Verific datele
        if(user.lastname == null || user.firstname == null || 
            user.email == null || user.password == null ||
            user.url == null) {
                request.statusCode = 400;
                request.statusCodeMessage = "Bad Request";
                request.errorMessage = "Request-ul de tip POST primit la pagina /register nu este unul valid!";
                return errorRoute(request, response);
        }

        if(user.lastname.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Campul numelui nu poate fi gol!";
            return registerRoute(request, response);
        }

        if(user.firstname.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.previousLastnameValue = user.lastname;
            request.errorMessage = "Campul prenumelui nu poate fi gol!";
            return registerRoute(request, response);
        }

        if(user.email.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.errorMessage = "Campul adresei de email nu poate fi gol!";
            return registerRoute(request, response);
        }

        if(user.password.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.errorMessage = "Campul parolei nu poate fi gol!";
            return registerRoute(request, response);
        }

        if(user.url.length == 0){
            response.statusCode = 401; // 401 - Unauthorized
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.errorMessage = "Campul adresei site-ului web nu poate fi gol!";
            return registerRoute(request, response);
        }

        if(!/^[A-Za-z]+$/.test(user.lastname)) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Numele nu este valid!";
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.previousUrlValue = user.url;
            return registerRoute(request, response);
        }

        if(!/^[A-Za-z]+$/.test(user.firstname)) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Prenumele nu este valid!";
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.previousUrlValue = user.url;
            return registerRoute(request, response);
        }

        if(!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(user.email)) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Adresa de email nu este valida!";
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.previousUrlValue = user.url;
            return registerRoute(request, response);
        }

        if(user.password.length < 6) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Parola trebuie sa contina cel putin 6 caractere!";
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.previousUrlValue = user.url;
            return registerRoute(request, response);
        }

        if(!/^((http|https):\/\/)?[A-Za-z]+\.([A-Za-z]+\.|[A-Za-z]+)+[\/]?[[A-Za-z0-9/.=+?"'!@#$%^&*() -_]*]?$/.test(user.url)) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Adresa site-ului web nu este valida!";
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.previousUrlValue = user.url;
            return registerRoute(request, response);
        }

        // Verific daca modelul apare in baza de date
                                                                                            // TODO

        // Adaug modelul in baza de date
                                                                                            // TODO

        // TODO: Create appropiate response
        response.end('ok');
    });    
}

module.exports = {handleLoginRequest, handleRegisterRequest};