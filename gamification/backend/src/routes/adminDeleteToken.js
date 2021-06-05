const renderPage = require("../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const tokensRepository = require("../repositories/tokensRepository");

const adminDeleteTokenRoute = async (request, response) => {
    try {
        const queryString = request.url.split('?')[1];
        const queryObject = querystringParser.parse(queryString);

        request.token = queryObject.token;

        if (!request.token) {
            response.write("Bad URL");
            response.end();
            return;
        }

        // decode token
        request.token = decodeURIComponent(request.token);

        await tokensRepository.deleteTokenFromDatabase(request.token);

        response.writeHead(302, {'Location': '/admin/tokens'});
        response.end();
    } catch (error) {
        response.writeHead(302, {'Location': '/admin/tokens'});
        response.end();
    }
}

module.exports = adminDeleteTokenRoute;