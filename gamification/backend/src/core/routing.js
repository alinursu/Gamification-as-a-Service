const indexRoute = require("../routes/index");

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
    }

    // 404 Not found 
    response.write('<h1>404<h1>');
    response.end();
}

module.exports = routing;