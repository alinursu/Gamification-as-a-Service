const indexRoute = require("../routes/index");
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');
const documentationRoute = require('../routes/documentation');
const profileRoute = require('../routes/profile');
const errorRoute = require("../routes/error");
const formRoute = require("../routes/form");

const userController = require('../controllers/userController');
const contactMessageController = require('../controllers/contactMessageController');

const staticServe = require('node-static');
const path = require('path');
var cookie = require('cookie');
const file = new staticServe.Server(path.join(__dirname, '../../pages/'), { cache: 1 });

/**
 * Face rutarea.
 * @param {*} request Request-ul dat.
 * @param {*} response Raspunsul dat de server.
 * @returns Pagina generata.
 */
const routing = (request, response) => {
    const url = request.url;
    var cookies = cookie.parse(request.headers.cookie || '');

    // Request-uri de tip PUT
    if(request.method == 'PUT') {
        if(url.startsWith('/profile/change_url')) {
            if(cookies.authToken != null) {
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
        request.errorMessage = "Nu poți face un request de tip PUT la pagina \"" + url +"\"!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    // Request-uri de tip POST
    if(request.method == 'POST') {
        switch (url) {
            case '/':
                return contactMessageController.handleContactRequest(request, response);

            case '/login': {
                if(cookies.authToken == null) {
                    return userController.handleLoginRequest(request, response);
                }

                // Utilizatorul este autentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Ești deja autentificat!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
                

            case '/register': {
                if(cookies.authToken == null) {
                    return userController.handleRegisterRequest(request, response);
                }

                // Utilizatorul este autentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Ești deja autentificat!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            case '/profile/change_url': {
                if(cookies.authToken != null) {
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
                if(cookies.authToken != null) {
                    return userController.handleChangePasswordRequest(request, response);
                }

                // Utilizatorul este neautentificat - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }

            default: {
                // Nu poti face un request de tip POST la pagina {{url}} - 403 Forbidden
                response.statusCode = 403;
                request.statusCodeMessage = "Forbidden";
                request.errorMessage = "Nu poți face un request de tip POST la pagina \"" + url +"\"!";
                response.setHeader('Location', '/error');
                return errorRoute(request, response);
            }
        }
    }

    // Rutari (request-uri de tip GET pentru resurse)
    switch (url) {
        case '/': {
            return indexRoute(request, response);
        }
            
        case '/login': {
            if(cookies.authToken == null) {
                return loginRoute(request, response);
            }

            // Utilizator autentificat; il redirectionez catre pagina principala - 307  Temporary Redirect
            response.writeHead(307, {'Location': '/'});
            response.end();
            return;
        }

        case '/register': {
            if(cookies.authToken == null) {
                return registerRoute(request, response);
            }

            // Utilizator autentificat; il redirectionez catre pagina principala - 307  Temporary Redirect
            response.writeHead(307, {'Location': '/'});
            response.end();
            return;
        }

        case '/logout': {
            if(cookies.authToken != null) {
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
            if(cookies.authToken != null) {
                return profileRoute(request, response);
            }
            
            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }
        
        case '/profile/change_url': {
            if(cookies.authToken != null) {
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
            if(cookies.authToken != null) {
                return profileRoute(request, response);
            }
            
            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        case '/form': {
            // if(cookies.authToken != null) {
                return formRoute(request, response);
            // }

            // Utilizator neautentificat; il redirectionez catre pagina de eroare => 403 Forbidden
            response.statusCode = 403;
            request.statusCodeMessage = "Forbidden";
            request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
            response.setHeader('Location', '/error');
            return errorRoute(request, response);
        }

        default: {
            // Rutari CSS
            if(url.toString().substr(0, 8) === '/styles/') {
                return file.serve(request, response)
            }

            // Rutari pentru imagini
            if(url.toString().substr(0, 8) === '/images/') {
                return file.serve(request, response);
            }

            // Rutari client-side JS
            if(url.toString().substr(0, 4) === '/js/') {
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