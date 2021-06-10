const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const gamificationUserDataRepository = require("../../repositories/gamificationSystemExternalRepository");

const adminDeleteUserDataRoute = async (request, response) => {
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

        await gamificationUserDataRepository.deleteUserDataByApi(request.api_key);

        response.writeHead(302, {'Location': '/admin/user-data'});
        response.end();
    } catch (error) {
        response.writeHead(302, {'Location': '/admin/user-data'});
        response.end();
    }
}

module.exports = adminDeleteUserDataRoute;