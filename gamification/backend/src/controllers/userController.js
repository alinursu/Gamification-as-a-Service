const { parse } = require('querystring');
var cookie = require('cookie');

const UserModel = require('../models/User');
const registerRoute = require('../routes/register');
const profileRoute = require('../routes/profile');
const errorRoute = require('../routes/error');
const {verifyPresenceOfLoginCredentials, validateLoginCredentials, generateAuthCookie, verifyPresenceOfRegisterCredentials, 
    validateRegisterCredentials, verifyPresenceOfChangeURLCredentials, validateChangeURLCredentials, 
    verifyPresenceOfChangePasswordCredentials, validateChangePasswordCredentials} = require('../services/userServices');

/**
 * Rezolva un request de tip POST facut la pagina /login.
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
        var serviceResponse = verifyPresenceOfLoginCredentials(user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateLoginCredentials(user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Verific daca modelul apare in baza de date 
                                                                                            // TODO + preluare din DB

        // Creez un cookie care sa pastreze utilizatorul autentificat
        var token = generateAuthCookie(parsedBody.rememberChckBox, request, response);

        // TODO: Adaug token-ul in baza de date, impreuna cu userID, userFname si userLname

        // Redirectionez utilizatorul catre pagina principala - 307 Temporary Redirect
        response.writeHead(307, {'Location': '/'});
        response.end();
    });    
}

/**
 * Rezolva un request de tip POST facut la pagina /register.
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
        var serviceResponse = verifyPresenceOfRegisterCredentials(user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateRegisterCredentials(user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Verific daca modelul apare in baza de date
                                                                                            // TODO

        // Adaug modelul in baza de date
                                                                                            // TODO

        response.statusCode = 201;
        request.successMessage = "Contul a fost creat cu succes!";
        request.previousLastnameValue = user.lastname;
        request.previousFirstnameValue = user.firstname;
        request.previousEmailValue = user.email;
        request.previousUrlValue = user.url;
        return registerRoute(request, response);
    });    
}

/**
 * Rezolva un request de tip GET facut in pagina /logout.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
 function handleLogoutRequest(request, response) {
    var cookies = cookie.parse(request.headers.cookie || '');
    var token = cookies.authToken;

    response.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,
        maxAge: 0
    }));

    // TODO: Sterg token-ul din baza de date

    // Redirectionez utilizatorul catre pagina principala - 307 Temporary Redirect
    response.writeHead(307, {'Location': '/'});
    response.end();
}

/**
 * Rezolva un request de tip PUT/POST facut la pagina /profile/change_url.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleChangeURLRequest(request, response) {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // TODO: preiau modelul din baza de date in functie de token
        var previousURL = 'http://previous.url/'; // TODO: de luat din model
        let user = new UserModel(null, null, null, null, null, parsedBody.new_url);

        // Verific datele
        var serviceResponse = verifyPresenceOfChangeURLCredentials(previousURL, user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateChangeURLCredentials(user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // TODO: Fac update in baza de date

        request.successMessage = "Adresa site-ului web a fost modificată cu succes!";
        return profileRoute(request, response);
    });    
}

/**
 * Rezolva un request de tip POST facut la pagina /profile/change_password.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
 function handleChangePasswordRequest(request, response) {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // TODO: preiau modelul din baza de date in functie de token
        let user = new UserModel(null, null, null, null, parsedBody.new_password, null);

        // Verific datele
        var serviceResponse = verifyPresenceOfChangePasswordCredentials(parsedBody.old_password, user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateChangePasswordCredentials(parsedBody.old_password, user, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // TODO: Fac update in baza de date

        request.successMessage = "Parola a fost modificată cu succes!";
        return profileRoute(request, response);
    });    
}

module.exports = {handleLoginRequest, handleRegisterRequest, handleLogoutRequest, handleChangeURLRequest, handleChangePasswordRequest};