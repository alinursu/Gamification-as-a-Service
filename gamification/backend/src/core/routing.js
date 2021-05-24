const indexRoute = require("../routes/index");
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');
const documentationRoute = require('../routes/documentation');
const profileRoute = require('../routes/profile');
const errorRoute = require("../routes/error");

const userController = require('../controllers/userController');
const contactMessageController = require('../controllers/contactMessageController');

const staticServe = require('node-static');
const path = require('path');
const file = new staticServe.Server(path.join(__dirname, '../../pages/'), { cache: 1 });

/**
 * Face rutarea.
 * @param {*} request Request-ul dat.
 * @param {*} response Raspunsul dat de server.
 * @returns Pagina generata.
 */
const routing = (request, response) => {
    const url = request.url;

    // Request-uri de tip POST
    if(request.method == 'POST') {
        switch (url) {
            case '/':
                return contactMessageController.handleContactRequest(request, response);

            case '/login':
                return userController.handleLoginRequest(request, response);

            case '/register':
                return userController.handleRegisterRequest(request, response);
        }
    }

    // Request-uri custom de tip GET

    // Rutari
    switch (url) {
        case '/':
            return indexRoute(request, response);
        
        case '/login':
            return loginRoute(request, response);

        case '/register':
            return registerRoute(request, response);

        case '/documentation':
            return documentationRoute(request, response);

        case '/profile':
            return profileRoute(request, response);

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
            request.errorMessage = "Nu am gasit pagina pe care incerci sa o accesezi!";
            return errorRoute(request, response);
        }

    }

    
}

module.exports = routing;