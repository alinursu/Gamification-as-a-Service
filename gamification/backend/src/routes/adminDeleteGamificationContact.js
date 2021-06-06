const renderPage = require("../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const gamificationContactRepository = require("../repositories/contactMessagesRepository");

const adminDeleteContactRoute = async (request, response) => {
    try {
        const queryString = request.url.split('?')[1];
        const queryObject = querystringParser.parse(queryString);

        request.id = queryObject.id;

        if (!request.id) {
            response.write("Bad URL");
            response.end();
            return;
        }
        console.log(request.id)
        await gamificationContactRepository.deleteContactById(request.id);
        response.writeHead(302, {'Location': '/admin/contact'});
        response.end();
    } catch (error) {
        console.log(error);
        response.writeHead(302, {'Location': '/admin/contact'});
        response.end();
    }
}

module.exports = adminDeleteContactRoute;