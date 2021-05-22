const indexRoute = require("../routes/index");
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');
const formRoute = require('../routes/form')
const staticServe = require('node-static');
const path = require('path');
const file = new staticServe.Server(path.join(__dirname, '../../pages/'), {cache: 1});

/**
 * Handles the routing.
 * @param {*} request The given request.
 * @param {*} response The response based on the request.
 * @returns The rendered page.
 */
const routing = (request, response) => {
    const url = request.url;

    // Routes
    switch (url) {
        case '/':
            return indexRoute(request, response);

        case '/login':
            return loginRoute(request, response);

        case '/register':
            return registerRoute(request, response);

        case '/form':
            return formRoute(request, response);

        default: {
            // CSS routes
            if (url.toString().substr(0, 8) === '/styles/') {
                return file.serve(request, response)
            }

            // Image routes
            if (url.toString().substr(0, 8) === '/images/') {
                return file.serve(request, response);
            }

            // JS routes
            if (url.toString().substr(0, 4) === '/js/') {
                return file.serve(request, response);
            }

            // 404 Not found 
            response.write('<h1>404<h1>');
            response.end();
        }
    }
}

module.exports = routing;