const indexRoute = require("../routes/index");
const loginRoute = require('../routes/login');
const registerRoute = require('../routes/register');

/**
 * Handles the routing.
 * @param {*} request The given request. 
 * @param {*} response The response based on the request.
 * @returns The rendered HTML page.
 */
const routing = (request, response) => {
    const url = request.url;

    // Fixed routes
    switch (url) {
        case '/':
            return indexRoute(request, response);
        
        case '/login':
            return loginRoute(request, response);

        case '/register':
            return registerRoute(request, response);
    }

    // 404 Not found 
    response.write('<h1>404<h1>');
    response.end();
}

module.exports = routing;