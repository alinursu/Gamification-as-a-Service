const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const usersRepository = require("../../repositories/usersRepository");

const adminDeleteUserRoute = async (request, response) => {
    try {
        const queryString = request.url.split('?')[1];
        const queryObject = querystringParser.parse(queryString);

        request.userId = queryObject.id;

        if (!request.userId) {
            response.write("Bad URL");
            response.end();
            return;
        }

        await usersRepository.deleteUserById(request.userId);

        response.writeHead(302, {'Location': '/admin/users'});
        response.end();
    } catch (error) {
        response.writeHead(302, {'Location': '/admin/users'});
        response.end();
    }
}

module.exports = adminDeleteUserRoute;