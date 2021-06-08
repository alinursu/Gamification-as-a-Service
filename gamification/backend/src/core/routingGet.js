const indexRoute = require("../routes/index");
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');
const documentationRoute = require('../routes/documentation');
const profileRoute = require('../routes/profile');
const errorRoute = require("../routes/error");
const formRoute = require("../routes/form");
const adminUsersListRoute = require("../routes/admin/adminUsers");
const adminAddUserRoute = require("../routes/admin/adminAddUser");
const adminUpdateUserRoute = require("../routes/admin/adminUpdateUser");
const adminDeleteUserRoute = require("../routes/admin/adminDeleteUser");
const adminHomeRoute = require("../routes/admin/adminHome");
const adminGamificationSystemsRoute = require("../routes/admin/adminGamificationSystems");
const adminAddGamificationSystemRoute = require("../routes/admin/adminAddGamificationSystem");
const adminDeleteSystemRoute = require("../routes/admin/adminDeleteGamificationSystem");
const adminUpdateSystemRoute = require("../routes/admin/adminUpdateSystem");
const adminGamificationRewardsRoute = require("../routes/admin/adminGamificationRewards");
const adminDeleteRewardRoute = require("../routes/admin/adminDeleteGamificationReward");
const adminAddGamificationRewardRoute = require("../routes/admin/adminAddGamificationReward");
const adminUpdateRewardRoute = require("../routes/admin/adminUpdateReward");
const adminGamificationEventsRoute = require("../routes/admin/adminGamificationEvents");
const adminDeleteEventRoute = require("../routes/admin/adminDeleteGamificationEvent");
const adminAddGamificationEventRoute = require("../routes/admin/adminaddGamificationEvent");
const adminUpdateEventRoute = require("../routes/admin/adminUpdateEvent");
const adminTokensRoute = require("../routes/admin/adminTokens");
const adminDeleteTokenRoute = require("../routes/admin/adminDeleteToken");
const adminUserDataRoute = require("../routes/admin/adminUserData");
const adminAddUserDataRoute = require("../routes/admin/adminAddUserData");
const adminDeleteUserDataRoute = require("../routes/admin/adminDeleteUserData");
const adminUpdateUserDataRoute = require("../routes/admin/adminUpdateUserData");
const adminGamificationContactRoute = require("../routes/admin/adminGamificationContact");
const adminAddGamificationContactRoute = require("../routes/admin/adminAddGamificationContact");
const adminDeleteContactRoute = require("../routes/admin/adminDeleteGamificationContact");
const adminUpdateContactRoute = require("../routes/admin/adminUpdateContact");

const UserController = require('../controllers/UserController');
const TokenController = require('../controllers/TokenController');
const GamificationSystemController = require('../controllers/GamificationSystemController');
const GamificationSystemExternalController = require('../controllers/GamificationSystemExternalController');
const DataController = require('../controllers/DataController');

const utils = require('../internal/utils');

const path = require('path');
const staticServe = require('node-static');
const file = new staticServe.Server(path.join(__dirname, '../../pages/'), {cache: 1}); // TODO (la final): De facut caching-time mai mare (ex: 3600 == 1 ora)
const cookie = require('cookie');

/**
 * Face rutarea unui cereri de tip GET.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function route(request, response) {
    const url = request.url;
    let cookies = cookie.parse(request.headers.cookie || '');

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

module.exports = {route};