const errorRoute = require("../routes/error");
const UserController = require('../controllers/UserController');
const utils = require('../internal/utils');

const routingDelete = require('./routingDelete');
const routingPut = require('./routingPut');
const routingPost = require('./routingPost');
const routingGet = require('./routingGet');

const cookie = require('cookie');

/**
 * Face rutarea.
 * @param {*} request Request-ul dat.
 * @param {*} response Raspunsul dat de server.
 * @returns Pagina generata.
 */
const routing = async (request, response) => {
    const url = request.url;
    let userLoaded = false;
    let cookies = cookie.parse(request.headers.cookie || '');

    if (!url.startsWith('/styles/') && !url.startsWith('/images/') && !url.startsWith('/js/')) {
        // Daca utilizatorul este autentificat, preiau date despre contul acestuia din baza de date, date pe care le voi afisa in pagina
        request.userFullName = null;
        request.userURL = null;

        if (cookies.authToken != null) {
            let userModel = null;
            UserController.getUserModelByToken(cookies.authToken, request, response).then(function (result) {
                userModel = result;
                userLoaded = true;
            });

            while (userLoaded === false) {
                await utils.timeout(10);
            }


            if (userModel != null && userModel !== -1) {
                request.userFullName = userModel.firstname + " " + userModel.lastname;
                request.userURL = userModel.url;
            } else {
                if (userModel === null) {
                    return UserController.handleLogoutRequest(request, response);
                } else {
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }
            }
        }
    }

    if (request.method === 'DELETE') {
        return routingDelete.route(request, response);
    }

    // Request-uri de tip PUT
    if (request.method === 'PUT') {
        return routingPut.route(request, response);
    }

    // Request-uri de tip POST
    if (request.method === 'POST') {
        return routingPost.route(request, response);
    }

    // Rutari (request-uri de tip GET pentru resurse)
    if (request.method === 'GET') {
        return routingGet.route(request, response);
    }

    // Nu poti face un request de tip {{request.method}} la pagina {{url}} - 403 Forbidden
    response.statusCode = 403;
    request.statusCodeMessage = "Forbidden";
    request.errorMessage = "Nu poți face un request de tip " + request.method + " la pagina \"" + url + "\"!";
    response.setHeader('Location', '/error');
    return errorRoute(request, response);
}

module.exports = routing;