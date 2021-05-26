const { parse } = require('querystring');
var cookie = require('cookie');

const UserModel = require('../models/User');
const registerRoute = require('../routes/register');
const profileRoute = require('../routes/profile');
const loginRoute = require('../routes/login');
const utils = require('../internal/utils');
const usersRepository = require('../repositories/usersRepository');
const tokensRepository = require('../repositories/tokensRepository');
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
    request.on('end', async () => {
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
        var databaseUserModel = null;
        usersRepository.verifyUserModelLoginCredentials(user).then(function(result) {
            databaseUserModel = result;
        });
        await utils.timeout(1000);

        if(databaseUserModel == null) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Adresa de email sau parola este incorectă!";
            request.previousEmailValue = user.email;
            loginRoute(request, response);
            return;
        }

        // Creez un cookie care sa pastreze utilizatorul autentificat
        var token = generateAuthCookie(parsedBody.rememberChckBox, request, response);

        // Adaug token-ul in baza de date, impreuna cu user.id, user.firstname si user.lastname
        tokensRepository.addTokenToDatabase(token, databaseUserModel);

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
    request.on('end', async () => {
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

        // Verific daca exista un model in baza de date cu email-ul introdus de client
        var databaseResponse;
        usersRepository.verifyUserModelRegisterCredentials(user).then(function(result) {
            databaseResponse = result;
        });
        await utils.timeout(1000);

        if(databaseResponse == 1) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Există un cont creat cu această adresă de email!";
            request.previousLastnameValue = user.lastname;
            request.previousFirstnameValue = user.firstname;
            request.previousEmailValue = user.email;
            request.previousUrlValue = user.url;
            registerRoute(request, response);
            return;
        }

        // Adaug modelul in baza de date
        usersRepository.insertUserModel(user);

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

    // Sterg token-ul din baza de date
    tokensRepository.deleteTokenFromDatabase(token);

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
    var cookies = cookie.parse(request.headers.cookie || '');
    var token = cookies.authToken;

    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Preiau modelul User din baza de date cu ajutorul token-ului
        var userId;
        tokensRepository.getUserIdByToken(token).then(function(result) {
            userId = result;
        });
        await utils.timeout(1000);

        var userModel;
        usersRepository.getUserModelById(userId).then(function(result) {
            userModel = result;
        })
        await utils.timeout(1000);

        var previousURL = userModel.url;
        userModel.url = parsedBody.new_url;

        // Verific datele
        var serviceResponse = verifyPresenceOfChangeURLCredentials(previousURL, userModel, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateChangeURLCredentials(userModel, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Fac update in baza de date
        usersRepository.updateUserModelURL(userModel);

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
    var cookies = cookie.parse(request.headers.cookie || '');
    var token = cookies.authToken;

    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Preiau modelul User din baza de date cu ajutorul token-ului
        var userId;
        tokensRepository.getUserIdByToken(token).then(function(result) {
            userId = result;
        });
        await utils.timeout(1000);

        var userModel;
        usersRepository.getUserModelById(userId).then(function(result) {
            userModel = result;
        })
        await utils.timeout(1000);

        var dbOldPassword = userModel.password;
        userModel.password = parsedBody.new_password;

        // Verific datele
        var serviceResponse = verifyPresenceOfChangePasswordCredentials(parsedBody.old_password, userModel, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateChangePasswordCredentials(parsedBody.old_password, dbOldPassword, userModel, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Fac update in baza de date
        usersRepository.updateUserModelPassword(userModel);

        request.successMessage = "Parola a fost modificată cu succes!";
        return profileRoute(request, response);
    });    
}

module.exports = {handleLoginRequest, handleRegisterRequest, handleLogoutRequest, handleChangeURLRequest, handleChangePasswordRequest};