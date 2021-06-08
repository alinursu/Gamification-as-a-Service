const errorRoute = require("../routes/error");
const adminAddUserPOSTRoute = require("../routes/admin/adminAddUserPOST");
const adminUpdateUserPUTRoute = require("../routes/admin/adminUpdateUserPOST");
const adminUpdateSystemPUTRoute = require("../routes/admin/adminUpdateSystemPOST");
const adminAddSystemPOSTRoute = require("../routes/admin/adminAddSystemPOST");
const adminAddRewardPOSTRoute = require("../routes/admin/adminAddRewardPOST");
const adminUpdateRewardPUTRoute = require("../routes/admin/adminUpdateRewardPOST");
const adminAddEventPOSTRoute = require("../routes/admin/adminAddEventPOST");
const adminUpdateEventPUTRoute = require("../routes/admin/adminUpdateEventPOST");
const adminAddUserDataPOSTRoute = require("../routes/admin/adminAddUserDataPOST");
const adminUpdateUserDataPUTRoute = require("../routes/admin/adminUpdateUserDataPOST");
const adminAddContactPOSTRoute = require("../routes/admin/adminAddContactPOST");
const adminUpdateContactPOSTRoute = require("../routes/admin/adminUpdateContactPOST");

const UserController = require('../controllers/UserController');
const ContactMessageController = require('../controllers/ContactMessageController');
const GamificationSystemController = require('../controllers/GamificationSystemController');
const GamificationSystemExternalController = require('../controllers/GamificationSystemExternalController');
const RequestsLimiterController = require('../controllers/RequestsLimiterController');
const DataController = require('../controllers/DataController');

const cookie = require('cookie');

/**
 * Face rutarea unui cereri de tip POST.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function route(request, response) {
    const url = request.url;
    let cookies = cookie.parse(request.headers.cookie || '');

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

module.exports = {route};