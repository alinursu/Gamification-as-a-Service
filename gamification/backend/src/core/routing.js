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
const adminUserDataRoute = require("../routes/adminUserData");
const adminAddUserDataRoute = require("../routes/adminAddUserData");
const adminAddUserDataPOSTRoute = require("../routes/adminAddUserDataPOST");
const adminDeleteUserDataRoute = require("../routes/adminDeleteUserData");
const adminUpdateUserDataRoute = require("../routes/adminUpdateUserData");
const adminUpdateUserDataPUTRoute = require("../routes/adminUpdateUserDataPOST");
const adminGamificationContactRoute = require("../routes/adminGamificationContact");
const adminAddGamificationContactRoute = require("../routes/adminAddGamificationContact");
const adminAddContactPOSTRoute = require("../routes/adminAddContactPOST");
const adminDeleteContactRoute = require("../routes/adminDeleteGamificationContact");
const adminUpdateContactRoute = require("../routes/adminUpdateContact");
const adminUpdateContactPOSTRoute = require("../routes/adminUpdateContactPOST");

const UserController = require('../controllers/UserController');
const TokenController = require('../controllers/TokenController');
const ContactMessageController = require('../controllers/ContactMessageController');
const GamificationSystemController = require('../controllers/GamificationSystemController');
const GamificationSystemExternalController = require('../controllers/GamificationSystemExternalController');
const RequestsLimiterController = require('../controllers/RequestsLimiterController');
const DataController = require('../controllers/DataController');

const utils = require('../internal/utils');

const path = require('path');
const staticServe = require('node-static');
const cookie = require('cookie');
const file = new staticServe.Server(path.join(__dirname, '../../pages/'), {cache: 1}); // TODO (la final): De facut caching-time mai mare (ex: 3600 == 1 ora)


/**
 * Face rutarea.
 * @param {*} request Request-ul dat.
 * @param {*} response Raspunsul dat de server.
 * @returns Pagina generata.
 */
const routing = async (request, response) => {
    const url = request.url;
    let cookies = cookie.parse(request.headers.cookie || '');

    if (!url.startsWith('/styles/') && !url.startsWith('/images/') && !url.startsWith('/js/')) {
        // Daca utilizatorul este autentificat, preiau date despre contul acestuia din baza de date, date pe care le voi afisa in pagina
        request.userFullName = null;
        request.userURL = null;

        if (cookies.authToken != null) {
            let userModel = null;
            UserController.getUserModelByToken(cookies.authToken, request, response).then(function (result) {
                userModel = result;
            });

            while (userModel === null) {
                await utils.timeout(10);
            }

            if(userModel != null && userModel !== -1) {
                request.userFullName = userModel.firstname + " " + userModel.lastname;
                request.userURL = userModel.url;
            }
            else {
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                    "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                return errorRoute(request, response);
            }
        }
    }

    // Request-uri de tip DELETE
    if (request.method === 'DELETE') {
        // Rutari dinamice DELETE
        if (url.startsWith('/profile/delete-gamification-system')) {
            if (cookies.authToken != null) {
                return GamificationSystemController.handleDeleteGamificationSystemRequest(request, response);
            }

            // Utilizatorul este neautentificat - 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        if (url.startsWith('/external/gamification-system')) {
            return GamificationSystemExternalController.handleExternalGamificationSystemDELETERequest(request, response);
        }
    }

    // Request-uri de tip PUT
    if (request.method === 'PUT') {
        // Rutari dinamice PUT
        if (url.startsWith('/profile/change-url')) {
            if (cookies.authToken != null) {
                return UserController.handleChangeURLRequest(request, response);
            }

            // Utilizatorul este neautentificat - 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        if (url.startsWith('/profile/modify-gamification-system')) {
            if (cookies.authToken != null) {
                return GamificationSystemController.handleModifyGamificationSystemRequest(request, response);
            }

            // Utilizatorul este neautentificat - 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        if (url.startsWith('/external/gamification-system')) {
            return GamificationSystemExternalController.handleExternalGamificationSystemPOSTPUTRequest(request, response);
        }

        // Nu poti face un request de tip PUT la pagina {{url}} - 403 Forbidden
        response.statusCode = 403;
        request.statusCodeMessage = "Forbidden";
        request.errorMessage = "Nu poți face un request de tip PUT la pagina \"" + url + "\"!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    // Request-uri de tip POST
    if (request.method === 'POST') {
        switch (url) {
            case '/': {
                return ContactMessageController.handleContactRequest(request, response);
            }

            case '/login': {
                if (cookies.authToken == null) {
                    await RequestsLimiterController.loginRequestsLimiterFunction(request, response, function (request, response) {
                        return UserController.handleLoginRequest(request, response);
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
                    await RequestsLimiterController.registerRequestsLimiterFunction(request, response, function (request, response) {
                        return UserController.handleRegisterRequest(request, response);
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

            case '/profile/change-url': {
                if (cookies.authToken != null) {
                    return UserController.handleChangeURLRequest(request, response);
                }

                // Utilizatorul este neautentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            case '/profile/change-password': {
                if (cookies.authToken != null) {
                    return UserController.handleChangePasswordRequest(request, response);
                }

                // Utilizatorul este neautentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            case '/profile/create-gamification-system': {
                if (cookies.authToken != null) {
                    return GamificationSystemController.handleCreateGamificationSystemRequest(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

            case '/admin/contact/update': {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateContactPOSTRoute(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return DataController.handleImportUsersRequest(request, response);
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

            case '/admin/contact/import': {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return DataController.handleImportContactMessagesRequest(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return DataController.handleImportGamificationEventsRequest(request, response);
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

            case '/admin/user-data/add': {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminAddUserDataPOSTRoute(request, response);
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

            case '/admin/contact/add': {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminAddContactPOSTRoute(request, response);
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

            case '/admin/gamification-systems/update': {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return DataController.handleImportGamificationSystemsRequest(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return DataController.handleImportGamificationRewardsRequest(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

            case '/admin/user-data/update': {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return  adminUpdateUserDataPUTRoute(request, response);
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
                if (url.startsWith('/profile/modify-gamification-system')) {
                    if (cookies.authToken != null) {
                        return GamificationSystemController.handleModifyGamificationSystemRequest(request, response);
                    }

                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                if (url.startsWith('/profile/delete-gamification-system')) {
                    if (cookies.authToken != null) {
                        return GamificationSystemController.handleDeleteGamificationSystemRequest(request, response);
                    }

                    // Utilizatorul este neautentificat - 403 Forbidden
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }


                if (url.startsWith('/external/gamification-system')) {
                    return GamificationSystemExternalController.handleExternalGamificationSystemPOSTPUTRequest(request, response);
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
            await TokenController.deleteAllExpiredTokens();

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
                return UserController.handleLogoutRequest(request, response);
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
                return UserController.handleGETProfileRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/profile/change-url': {
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

        case '/profile/change-password': {
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

        case '/profile/create-gamification-system': {
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleGamificationSystemsExport(request, response);
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleExportGamificationRewardsRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/admin/contact/export': {
            if(cookies.authToken != null) {
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleContactMessagesExportRequest(request, response);
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

        case '/admin/user-data': {
            if (cookies.authToken != null) {
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if(result) return adminUserDataRoute(request, response);
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

        case '/admin/user-data/export': {
            if(cookies.authToken != null) {
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleExportGamificationUserDataRequest(request, response);
            }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/admin/contact': {
            if (cookies.authToken != null) {
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminGamificationContactRoute(request, response);
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleExportTokensRequest(request, response);
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

        case '/admin/user-data/add': {
            if (cookies.authToken != null) {
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminAddUserDataRoute(request, response);
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
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleExportUsersRequest(request, response);
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

        case '/admin/contact/add': {
            if (cookies.authToken != null) {
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    if (result) return adminAddGamificationContactRoute(request, response);
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
                let isAdmin = null;
                await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                    isAdmin = result;
                })

                while(isAdmin == null) {
                    await utils.timeout(10);
                }

                if(isAdmin === -1) { // Database error
                    // Creez un raspuns, instiintand utilizatorul de eroare
                    response.statusCode = 500;
                    request.statusCodeMessage = "Internal Server Error";
                    request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                    return errorRoute(request, response);
                }

                if(isAdmin === false) {
                    response.statusCode = 403;
                    request.statusCodeMessage = "Forbidden";
                    request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                    response.setHeader('Location', '/error');
                    return errorRoute(request, response);
                }

                return DataController.handleExportGamificationEventsRequest(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

            if (url.startsWith('/admin/user-data/update')) {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateUserDataRoute(request, response);
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

            if (url.startsWith('/admin/contact/update')) {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminUpdateContactRoute(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

            if (url.startsWith('/admin/user-data/delete')) {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteUserDataRoute(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

            if (url.startsWith('/admin/contact/delete')) {
                if (cookies.authToken != null) {
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
                        if (result) return adminDeleteContactRoute(request, response);
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
                    await UserController.isUserAdmin(cookies.authToken, request, response).then(function (result) {
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

            if (url.startsWith('/profile/view-gamification-system')) {
                if (cookies.authToken != null) {
                    return GamificationSystemController.handleViewGamificationSystemRequest(request, response, '/profile/view-gamification-system');
                }

                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            if (url.startsWith('/profile/modify-gamification-system')) {
                if (cookies.authToken != null) {
                    return GamificationSystemController.handleViewGamificationSystemRequest(request, response, '/profile/modify-gamification-system');
                }

                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            if (url.startsWith('/profile/delete-gamification-system')) {
                if (cookies.authToken != null) {
                    return GamificationSystemController.handleViewGamificationSystemRequest(request, response, '/profile/delete-gamification-system');
                }

                // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            if(url.startsWith('/external/gamification-system/top-users')) {
                return GamificationSystemExternalController.handleExternalGamificationSystemTopUsersGETRequest(request, response);
            }

            if(url.startsWith('/external/gamification-system')) {
                return GamificationSystemExternalController.handleExternalGamificationSystemGETRequest(request, response);
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