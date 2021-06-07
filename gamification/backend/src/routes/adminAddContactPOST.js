const renderPage = require("../core/render");
const path = require("path");
const gamificationContactRepository = require("../repositories/ContactMessagesRepository");
const GamificationContact = require("../models/ContactMessage");
const {parse} = require('querystring');

const adminAddContactPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);
        const newContact = new GamificationContact(null, parsedBody['sender-name'], parsedBody['sender-email'], parsedBody.message);
        await gamificationContactRepository.addContactMessageToDatabase(newContact);

        response.writeHead(302, {'Location': '/admin/contact'});
        response.end();
    });
}

module.exports = adminAddContactPOSTRoute;