const { parse } = require('querystring');
let cookie = require('cookie');

const UserModel = require('../models/User');

const registerRoute = require('../routes/register');
const profileRoute = require('../routes/profile');
const loginRoute = require('../routes/login');
const errorRoute = require('../routes/error');

const utils = require('../internal/utils');

const UserServices = require('../services/userServices');
const GamificationSystemServices = require('../services/gamificationSystemServices');
const TokensServices = require("../services/tokensServices");

/**
 * Preia din baza de date un model User pe baza unui token de autentificare.
 * @param {*} token Token-ul dupa care se face cautarea.
 * @returns Modelul User asociat token-ului de autentificare; null, daca nu exista unul
 */
async function getUserModelByToken(token, request, response) {
    let userId = 0;
    await TokensServices.getUserIdByToken(token).then(function(result) {
        userId = result;
    });

    while(userId === 0) {
        await utils.timeout(10);
    }

    if(userId === -1) {
        // Sterg cookie-ul
        response.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
            httpOnly: true,
            maxAge: 0
        }));

        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        errorRoute(request, response);
        return -1;
    }

    let userModel = 0;
    await UserServices.getUserModelById(userId).then(function(result) {
        userModel = result;
    })

    while(userModel === 0) {
        await utils.timeout(10);
    }

    if(userModel === -1) { // Database error
        // Sterg cookie-ul
        response.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
            httpOnly: true,
            maxAge: 0
        }));

        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        errorRoute(request, response);
        return -1;
    }

    return userModel;
}

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

    let parsedBody = null;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Creez modelul
        let user = new UserModel(null, null, null, parsedBody.email, parsedBody.password, null);

        // Verific datele
        let serviceResponse = UserServices.verifyPresenceOfLoginCredentials(user, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Validez datele
        serviceResponse = UserServices.validateLoginCredentials(user, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Verific daca modelul apare in baza de date 
        let databaseUserModel = null;
        await UserServices.verifyUserModelLoginCredentials(user).then(function(result) {
            databaseUserModel = result;
        });

        if(databaseUserModel === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        if(databaseUserModel === null) {
            response.statusCode = 401; // 401 - Unauthorized
            request.errorMessage = "Adresa de email sau parola este incorectă!";
            request.previousEmailValue = user.email;
            loginRoute(request, response);
            return;
        }

        // Creez un cookie care sa pastreze utilizatorul autentificat
        let token = UserServices.generateAuthCookie(parsedBody.rememberChckBox, request, response);

        // Adaug token-ul in baza de date, impreuna cu user.id, user.firstname si user.lastname
        let dbAnswer = null;
        await TokensServices.addTokenToDatabase(token, databaseUserModel).then(function (result) {
            dbAnswer = result;
        });

        if(dbAnswer === -1) { // Database error
            // Sterg cookie-ul
            response.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
                httpOnly: true,
                maxAge: 0
            }));
            
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Redirectionez utilizatorul catre pagina principala - 303 See other
        response.writeHead(303, {'Location': '/'});
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

    let parsedBody = null;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Creez modelul
        let user = new UserModel(null, parsedBody.lastname, parsedBody.firstname,
            parsedBody.email, parsedBody.password, parsedBody.weburl);

        // Verific datele
        let serviceResponse = UserServices.verifyPresenceOfRegisterCredentials(user, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Validez datele
        serviceResponse = UserServices.validateRegisterCredentials(user, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Verific daca exista un model in baza de date cu email-ul introdus de client
        let databaseResponse = 0;
        await UserServices.verifyUserModelRegisterCredentials(user).then(function(result) {
            databaseResponse = result;
        });

        if(databaseResponse === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        if(databaseResponse === 1) {
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
        let dbAnswer = null;
        await UserServices.addUserModel(user).then(function (result) {
            dbAnswer = result;
        });

        if(dbAnswer === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

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
async function handleLogoutRequest(request, response) {
    let cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies.authToken;

    response.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,
        maxAge: 0
    }));

    // Sterg token-ul din baza de date
    let dbAnswer = null;
    await TokensServices.deleteToken(token).then(function (result) {
        dbAnswer = result;
    });

    while(dbAnswer === null) {
        await utils.timeout(10);
    }

    if(dbAnswer === -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        errorRoute(request, response);
        return;
    }

    // Redirectionez utilizatorul catre pagina principala - 303 See Other
    response.writeHead(303, {'Location': '/'});
    response.end();
}

/**
 * Rezolva un request de tip PUT/POST facut la pagina /profile/change-url.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleChangeURLRequest(request, response) {
    let cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies.authToken;

    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    let parsedBody = null;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Preiau modelul User din baza de date cu ajutorul token-ului
        let userModel = 0;
        await getUserModelByToken(token, request, response).then(function(result) {
            userModel = result;
        });

        while(userModel === 0) {
            await utils.timeout(10);
        }

        let previousURL = userModel.url;
        userModel.url = parsedBody.new_url;

        // Verific datele
        let serviceResponse = UserServices.verifyPresenceOfChangeURLCredentials(previousURL, userModel, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Validez datele
        serviceResponse = UserServices.validateChangeURLCredentials(userModel, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Fac update in baza de date
        let dbAnswer = null;
        await UserServices.updateUserModelURL(userModel).then(function (result) {
            dbAnswer = result;
        });

        if(dbAnswer === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        request.successMessage = "Adresa site-ului web a fost modificată cu succes!";
        request.userURL = userModel.url;
        return profileRoute(request, response);
    });    
}

/**
 * Rezolva un request de tip POST facut la pagina /profile/change-password.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleChangePasswordRequest(request, response) {
    let cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies.authToken;

    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    let parsedBody = null;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Preiau modelul User din baza de date cu ajutorul token-ului
        let userModel = null;
        await getUserModelByToken(token, request, response).then(function(result) {
            userModel = result;
        });

        let dbOldPassword = userModel.password;
        userModel.password = parsedBody.new_password;

        // Verific datele
        let serviceResponse = UserServices.verifyPresenceOfChangePasswordCredentials(parsedBody.old_password, userModel, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Validez datele
        serviceResponse = UserServices.validateChangePasswordCredentials(parsedBody.old_password, dbOldPassword, userModel, request, response);
        if(serviceResponse === 0) {
            return;
        }

        // Fac update in baza de date
        let dbAnswer = null;
        await UserServices.updateUserModelPassword(userModel).then(function (result) {
            dbAnswer = result;
        });

        if(dbAnswer === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        request.successMessage = "Parola a fost modificată cu succes!";
        return profileRoute(request, response);
    });    
}

/**
 * Rezolva un request de tip GET facut la pagina '/profile'.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
async function handleGETProfileRequest(request, response) {
    let cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies.authToken;

    // Iau modelul User folosindu-ma de token
    let userModel = 0;

    await getUserModelByToken(token, request, response).then(function (result) {
        userModel = result;
    });

    while(userModel === 0) {
        await utils.timeout(10);
    }

    if(userModel == null) {
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    // Preiau sistemele de recompense create de user, folosindu-ma de userId
    let listOfGamificationSystemModels = null;
    await GamificationSystemServices.getGamificationSystemModelsByUserId(userModel.id).then(function (result) {
        listOfGamificationSystemModels = result;
    })

    while(listOfGamificationSystemModels == null) {
        await utils.timeout(10);
    }

    if(listOfGamificationSystemModels === -1) {
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    // Construiesc raspunsul
    request.listOfGamificationSystemModels = listOfGamificationSystemModels;
    request.isAdmin = (userModel.isAdmin == 1 ? userModel.isAdmin : null);
    return profileRoute(request, response);
}

/**
 * Verifica daca utilizatorul este autentificat cu un cont ce are privilegii de admin.
 * @param token Token-ul asociat contului in care utilizatorul este in momentul actual conectat.
 * @returns true, daca este autentificat cu un cont ce are privilegii de admin; false, daca nu; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function isUserAdmin(token, request, response) {
    // Preiau modelul User pe baza token-ului
    let userModel = -1;
    await getUserModelByToken(token, request, response).then(function (result) {
        userModel = result;
    });

    while(userModel === -1) {
        await utils.timeout(10);
    }

    if(userModel == null) return false;

    return userModel.isAdmin;
}

module.exports = {
    handleLoginRequest,
    handleRegisterRequest,
    handleLogoutRequest,
    handleChangeURLRequest,
    handleChangePasswordRequest,
    getUserModelByToken,
    handleGETProfileRequest,
    isUserAdmin
};