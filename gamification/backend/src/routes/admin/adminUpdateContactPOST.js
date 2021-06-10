const renderPage = require("../../core/render");
const path = require("path");
const GamificationContact = require('../../models/ContactMessage');
const ContactMessages = require("../../repositories/contactMessagesRepository");
const {parse} = require('querystring');

const adminUpdateContactPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul *care vine de la form (name din hbs)*
        const parsedBody = parse(body);

        const newEvent = new GamificationContact(parsedBody.id, parsedBody['sender-name'], parsedBody['sender-email'], parsedBody.message);
        await ContactMessages.updateContactById(newEvent);

        response.writeHead(302, {'Location': '/admin/contact'});
        response.end();
    });
}

module.exports = adminUpdateContactPOSTRoute;