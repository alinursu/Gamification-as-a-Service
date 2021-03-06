const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const gamificationSystemsRepository = require("../../repositories/gamificationSystemsRepository");

const adminDeleteSystemRoute = async (request, response) => {
    try {
        const queryString = request.url.split('?')[1];
        const queryObject = querystringParser.parse(queryString);

        request.api_key = queryObject.api_key;

        if (!request.api_key) {
            response.write("Bad URL");
            response.end();
            return;
        }

        // decode api key
        request.api_key = decodeURIComponent(request.api_key);

        await gamificationSystemsRepository.deleteSystemByApi(request.api_key);

        response.writeHead(302, {'Location': '/admin/gamification-systems'});
        response.end();
    } catch (error) {
        console.log(error);
        response.writeHead(302, {'Location': '/admin/gamification-systems'});
        response.end();
    }
}

module.exports = adminDeleteSystemRoute;