const routing = require('./routing')

/**
 * Routing request handler.
 * @param {*} request The given request.
 * @param {*} response The response based on the request.
 * @returns The rendered HTML page.
 */
const requestHandler = (request, response) => {
    return routing(request, response);
}

module.exports = requestHandler;