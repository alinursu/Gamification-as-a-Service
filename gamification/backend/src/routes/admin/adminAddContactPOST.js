const renderPage = require("../../core/render");
const path = require("path");
const gamificationContactRepository = require("../../repositories/ContactMessagesRepository");
const GamificationContact = require("../../models/ContactMessage");
const utils = require("../../internal/utils");
const errorRoute = require("../error");
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

        let dbResult = null;
        await gamificationContactRepository.addContactMessageToDatabase(newContact).then(function(result) {
            dbResult = result;
        })

        while(dbResult == null) {
            await utils.timeout(10);
        }

        if(dbResult === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            return errorRoute(request, response);
        }

        response.writeHead(302, {'Location': '/admin/contact'});
        response.end();
    });
}

module.exports = adminAddContactPOSTRoute;