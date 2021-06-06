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
const gamificationSystemExternalController = require('../controllers/gamificationSystemExternalController');
const requestsLimiterController = require('../controllers/requestsLimiterController');
const dataController = require('../controllers/dataController');

const staticServe = require('node-static');
const path = require('path');
const utils = require('../internal/utils');
var cookie = require('cookie');
const adminDeleteUserRoute = require("../routes/adminDeleteUser");
const adminUpdateUserPUTRoute = require("../routes/adminUpdateUserPOST");
const adminHomeRoute = require("../routes/adminHome");
const adminGamificationSystemsRoute = require("../routes/adminGamificationSystems");
const adminAddGamificationSystemRoute = require("../routes/adminAddGamificationSystem");
const adminDeleteSystemRoute = require("../routes/adminDeleteGamificationSystem");
const adminUpdateSystemRoute = require("../routes/adminUpdateSystem");
const adminUpdateSystemPUTRoute = require("../routes/adminUpdateSystemPOST");
const adminAddSystemPOSTRoute = require("../routes/adminAddSystemPOST");
const adminGamificationRewardsRoute = require("../routes/adminGamificationRewards");
const adminDeleteRewardRoute = require("../routes/adminDeleteGamificationReward");
const adminAddGamificationRewardRoute = require("../routes/adminAddGamificationReward");
const adminAddRewardPOSTRoute = require("../routes/adminAddRewardPOST");
const adminUpdateRewardRoute = require("../routes/adminUpdateReward");
const adminUpdateRewardPUTRoute = require("../routes/adminUpdateRewardPOST");
const adminGamificationEventsRoute = require("../routes/adminGamificationEvents");
const adminDeleteEventRoute = require("../routes/adminDeleteGamificationEvent");
const adminAddGamificationEventRoute = require("../routes/adminaddGamificationEvent");
const adminAddEventPOSTRoute = require("../routes/adminAddEventPOST");
const adminUpdateEventRoute = require("../routes/adminUpdateEvent");
const adminUpdateEventPUTRoute = require("../routes/adminUpdateEventPOST");
const adminTokensRoute = require("../routes/adminTokens");
const adminDeleteTokenRoute = require("../routes/adminDeleteToken");

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
            userController.getUserModelByToken(cookies.authToken, request, response).then(function (result) {
                userModel = result;
            });

            while (userModel == null) {
                await utils.timeout(10);
            }
            request.userFullName = userModel.firstname + " " + userModel.lastname;
            request.userURL = userModel.url;
        }
    }

    // Request-uri de tip DELETE
    if (request.method == 'DELETE') {
        // Rutari dinamice DELETE
        if (url.startsWith('/profile/delete_gamification_system')) {
            if (cookies.authToken != null) {
                return gamificationSystemController.handleDeleteGamificationSystemRequest(request, response);
            }

            // Utilizatorul este neautentificat - 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        if (url.startsWith('/external/gamification_system')) {
            return gamificationSystemExternalController.handleExternalGamificationSystemDELETERequest(request, response);
        }
    }

    // Request-uri de tip PUT
    if (request.method == 'PUT') {
        // Rutari dinamice PUT
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

        if (url.startsWith('/profile/modify_gamification_system')) {
            if (cookies.authToken != null) {
                return gamificationSystemController.handleModifyGamificationSystemRequest(request, response);
            }

            // Utilizatorul este neautentificat - 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        if (url.startsWith('/external/gamification_system')) {
            return gamificationSystemExternalController.handleExternalGamificationSystemPOSTPUTRequest(request, response);
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
            case '/': {
                return contactMessageController.handleContactRequest(request, response);
            }

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
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminAddUserPOSTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
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
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateUserPUTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/users/import': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return dataController.handleImportUsersRequest(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-systems/add': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminAddSystemPOSTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-rewards/add': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminAddRewardPOSTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-events/add': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminAddEventPOSTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-events/import': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return dataController.handleImportGamificationEventsRequest(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-systems/update': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateSystemPUTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-systems/import': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return dataController.handleImportGamificationSystemsRequest(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-rewards/update': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateRewardPUTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-rewards/import': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return dataController.handleImportGamificationRewardsRequest(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            case '/admin/gamification-events/update': {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateEventPUTRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
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
                // Rutari dinamice POST
                if (url.startsWith('/profile/modify_gamification_system')) {
                    if (cookies.authToken != null) {
                        return gamificationSystemController.handleModifyGamificationSystemRequest(request, response);
                    }

                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                if (url.startsWith('/profile/delete_gamification_system')) {
                    if (cookies.authToken != null) {
                        return gamificationSystemController.handleDeleteGamificationSystemRequest(request, response);
                    }

                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                if (url.startsWith('/external/gamification_system')) {
                    return gamificationSystemExternalController.handleExternalGamificationSystemPOSTPUTRequest(request, response);
                }

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

        case '/admin/home': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    console.log(result);
                    if (result) return adminHomeRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
            return;

        }

        case '/admin/gamification-systems': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    console.log(result);
                    if (result) return adminGamificationSystemsRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
            return;
        }

        case '/admin/gamification-systems/export': {
            if(cookies.authToken != null) {
                var isAdmin = null;
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin == -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin == false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return dataController.handleGamificationSystemsExport(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/admin/gamification-rewards':{
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    console.log(result);
                    if (result) return adminGamificationRewardsRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
            return;
        }

        case '/admin/gamification-rewards/export': {
            if(cookies.authToken != null) {
                var isAdmin = null;
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin == -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin == false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return dataController.handleExportGamificationRewardsRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/admin/contact-messages/export': {
            if(cookies.authToken != null) {
                var isAdmin = null;
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin == -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin == false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return dataController.handleExportContactMessagesRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }
        case '/admin/gamification-events': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    console.log(result);
                    if (result) return adminGamificationEventsRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
            return;
        }


        case '/admin/users': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/tokens': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if(result) return adminTokensRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/tokens/export': {
            if(cookies.authToken != null) {
                var isAdmin = null;
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin == -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin == false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return dataController.handleExportTokensRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/admin/users/add': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminAddUserRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/users/export': {
            if(cookies.authToken != null) {
                var isAdmin = null;
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin == -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin == false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return dataController.handleExportUsersRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/admin/gamification-systems/add': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminAddGamificationSystemRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/gamification-rewards/add': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminAddGamificationRewardRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/gamification-events/add': {
            if (cookies.authToken != null) {
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminAddGamificationEventRoute(request, response);
                    else {
                        // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                        response.statusCode = 403;
                        request.statusCodeMessage = "Forbidden";
                        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                        response.setHeader('Location', '/error');
                        return errorRoute(request, response);
                    }
                });
            } else {
                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            return;
        }

        case '/admin/gamification-events/export': {
            if(cookies.authToken != null) {
                var isAdmin = null;
                await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin == -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin == false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return dataController.handleExportGamificationEventsRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        default: {
            // Rutari dinamice
            if (url.startsWith('/admin/users/update')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateUserRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            if (url.startsWith('/admin/gamification-systems/update')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateSystemRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            if (url.startsWith('/admin/gamification-rewards/update')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateRewardRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            if (url.startsWith('/admin/gamification-events/update')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateEventRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            if (url.startsWith('/admin/gamification-systems/delete')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteSystemRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }
                return;
            }

            if (url.startsWith('/admin/gamification-rewards/delete')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteRewardRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }
                return;
            }

            if (url.startsWith('/admin/gamification-events/delete')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteEventRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }
                return;
            }

            if (url.startsWith('/admin/tokens/delete')) {
                if (cookies.authToken != null) {
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteTokenRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
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
                    await userController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteUserRoute(request, response);
                        else {
                            // Utilizatorul nu are privilegii de administrator - 403 Forbidden
                            response.statusCode = 403;
                            request.statusCodeMessage = "Forbidden";
                            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                            response.setHeader('Location', '/error');
                            return errorRoute(request, response);
                        }
                    });
                } else {
                    // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return;
            }

            if (url.startsWith('/profile/view_gamification_system')) {
                if (cookies.authToken != null) {
                    return gamificationSystemController.handleViewGamificationSystemRequest(request, response, '/profile/view_gamification_system');
                }

                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            if (url.startsWith('/profile/modify_gamification_system')) {
                if (cookies.authToken != null) {
                    return gamificationSystemController.handleViewGamificationSystemRequest(request, response, '/profile/modify_gamification_system');
                }

                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            if (url.startsWith('/profile/delete_gamification_system')) {
                if (cookies.authToken != null) {
                    return gamificationSystemController.handleViewGamificationSystemRequest(request, response, '/profile/delete_gamification_system');
                }

                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            if(url.startsWith('/external/gamification_system/top_users')) {
                return gamificationSystemExternalController.handleExternalGamificationSystemTopUsersGETRequest(request, response);
            }

            if(url.startsWith('/external/gamification_system')) {
                return gamificationSystemExternalController.handleExternalGamificationSystemGETRequest(request, response);
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