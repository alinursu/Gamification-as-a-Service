const routing = require('./routing')

/**
 * Ruteaza request-ul.
 * @param {*} request Request-ul primit.
 * @param {*} response Raspunsul dat de server.
 * @returns Pagina HTML generata.
 */
const requestHandler = (request, response) => {
    return routing(request, response);
}

module.exports = requestHandler;