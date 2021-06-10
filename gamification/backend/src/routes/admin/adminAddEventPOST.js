const renderPage = require("../../core/render");
const path = require("path");
const gamificationSystemRepository = require("../../repositories/gamificationSystemsRepository");
const GamificationEvent = require("../../models/GamificationEvent");
const errorRoute = require("../error");
const utils = require("../../internal/utils");
const {parse} = require('querystring');

const adminAddEventPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newEvent = new GamificationEvent(null, parsedBody['system-api-key'], parsedBody.name, parsedBody.type);

        let dbResult = null;
        await gamificationSystemRepository.addGamificationEventToDatabase(newEvent).then(function(result) {
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

        response.writeHead(302, {'Location': '/admin/gamification-events'});
        response.end();
    });
}

module.exports = adminAddEventPOSTRoute;