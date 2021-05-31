const indexRoute = require("../routes/index");
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');
const documentationRoute = require('../routes/documentation');
const profileRoute = require('../routes/profile');
const errorRoute = require("../routes/error");
const formRoute = require("../routes/form");
const adminUsersListRoute = require("../routes/adminUsers");
const adminAddUserRoute = require("../routes/adminAddUser");
const adminUpdateUserRoute = require("../routes/adminUpdateUser");
const adminAddUserPOSTRoute = require("../routes/adminAddUserPOST");

const userController = require('../controllers/userController');
const tokenController = require('../controllers/tokenController');
const contactMessageController = require('../controllers/contactMessageController');
const gamificationSystemController = require('../controllers/gamificationSystemController');
const requestsLimiterController = require('../controllers/requestsLimiterController');

const staticServe = require('node-static');
const path = require('path');
const utils = require('../internal/utils');
var cookie = require('cookie');
const adminDeleteUserRoute = require("../routes/adminDeleteUser");
const adminUpdateUserPUTRoute = require("../routes/adminUpdateUserPOST");

const file = new staticServe.Server(path.join(__dirname, '../../pages/'), {cache: 1}); // TODO (la final): De facut caching-time mai mare (ex: 3600 == 1 ora)


/**
 * Face rutarea.
 * @param {*} request Request-ul dat.
 * @param {*} response Raspunsul dat de server.
 * @returns Pagina generata.
 */
const routing = async (request, response) => {
    const url = request.url;
    var cookies = cookie.parse(request.headers.cookie || '');

    if (!url.startsWith('/styles/') && !url.startsWith('/images/') && !url.startsWith('/js/')) {
        // Daca utilizatorul este autentificat, preiau date despre contul acestuia din baza de date, date pe care le voi afisa in pagina
        request.userFullName = null;
        request.userURL = null;

        if (cookies.authToken != null) {
            var userModel;
            userController.getUserModelByToken(cookies.authToken).then(function (result) {
                userModel = result;
            });

            while (userModel == null) {
                await utils.timeout(10);
            }
            request.userFullName = userModel.firstname + " " + userModel.lastname;
            request.userURL = userModel.url;
        }
    }

    // Request-uri de tip PUT
    if (request.method == 'PUT') {
        if (url.startsWith('/profile/change_url')) {
            if (cookies.authToken != null) {
                return userController.handleChangeURLRequest(request, response);
            }

            // Utilizatorul este neautentificat - 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }


        // Nu poti face un request de tip PUT la pagina {{url}} - 403 Forbidden
        response.statusCode = 403;
        request.statusCodeMessage = "Forbidden";
        request.errorMessage = "Nu poți face un request de tip PUT la pagina \"" + url + "\"!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    // Request-uri de tip POST
    if (request.method == 'POST') {
        switch (url) {
            case '/':
                return contactMessageController.handleContactRequest(request, response);

            case '/login': {
                if (cookies.authToken == null) {
                    await requestsLimiterController.loginRequestsLimiterFunction(request, response, function (request, response) {
                        return userController.handleLoginRequest(request, response);
                    });
                } else {
                    // Utilizatorul este autentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Ești deja autentificat!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/register': {
                if (cookies.authToken == null) {
                    await requestsLimiterController.registerRequestsLimiterFunction(request, response, function (request, response) {
                        return userController.handleRegisterRequest(request, response);
                    });
                } else {
                    // Utilizatorul este autentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Ești deja autentificat!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/profile/change_url': {
                if (cookies.authToken != null) {
                    return userController.handleChangeURLRequest(request, response);
                }

                // Utilizatorul este neautentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            case '/profile/change_password': {
                if (cookies.authToken != null) {
                    return userController.handleChangePasswordRequest(request, response);
                }

                // Utilizatorul este neautentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            case '/profile/create_gamification_system': {
                if (cookies.authToken != null) {
                    return gamificationSystemController.handleCreateGamificationSystemRequest(request, response);
                }

                // Utilizatorul este neautentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            case '/admin/users/add': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken).then(function (result) {
                        if(result) return adminAddUserPOSTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                }
                else {
                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/users/update': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken).then(function (result) {
                        if(result) return adminUpdateUserPUTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                }
                else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            default: {
                // Nu poti face un request de tip POST la pagina {{url}} - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu poți face un request de tip POST la pagina \"" + url + "\"!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
        }
    }

    // Rutari (request-uri de tip GET pentru resurse)
    switch (url) {
        case '/': {
            // Sterg din baza de date tokenii care au expirat (stergere periodica, de fiecare data cand cineva acceseaza homepage)
            await tokenController.deleteAllExpiredTokens();

            return indexRoute(request, response);
        }

        case '/login': {
            if (cookies.authToken == null) {
                return loginRoute(request, response);
            }

            // Utilizator autentificat; il redirectionez catre pagina principala - 307  Temporary Redirect
            response.writeHead(307, {'Location': '/'});
            response.end();
            return;
        }

        case '/register': {
            if (cookies.authToken == null) {
                return registerRoute(request, response);
            }

            // Utilizator autentificat; il redirectionez catre pagina principala - 307  Temporary Redirect
            response.writeHead(307, {'Location': '/'});
            response.end();
            return;
        }

        case '/logout': {
            if (cookies.authToken != null) {
                return userController.handleLogoutRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ești autentificat!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/documentation':
            return documentationRoute(request, response);

        case '/profile': {
            if (cookies.authToken != null) {
                return userController.handleGETProfileRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/profile/change_url': {
            if (cookies.authToken != null) {
                return profileRoute(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/profile/change_password': {
            if (cookies.authToken != null) {
                return profileRoute(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/profile/create_gamification_system': {
            if (cookies.authToken != null) {
                return formRoute(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }
        case '/admin/users': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken).then(function (result) {
                    console.log(result);
                    if(result) return adminUsersListRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            }
            else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/users/add': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken).then(function (result) {
                    if(result) return adminAddUserRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            }
            else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        default: {
            //Rutari dinamice ADMIN
            if (url.startsWith('/admin/users/update')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken).then(function (result) {
                        if(result) return adminUpdateUserRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                }
                else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            if (url.startsWith('/admin/users/delete')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken).then(function (result) {
                        if(result) return adminDeleteUserRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                }
                else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            // Rutari CSS
            if (url.startsWith('/styles/')) {
                return file.serve(request, response)
            }

            // Rutari pentru imagini
            if (url.startsWith('/images/')) {
                return file.serve(request, response);
            }

            // Rutari client-side JS
            if (url.startsWith('/js/')) {
                return file.serve(request, response);
            }

            // 404 Not found 
            response.statusCode = 404;
            request.statusCodeMessage = "Not Found";
            request.errorMessage = "Nu am găsit pagina pe care încerci sa o accesezi!";
            return errorRoute(request, response);
        }

    }


}

module.exports = routing;