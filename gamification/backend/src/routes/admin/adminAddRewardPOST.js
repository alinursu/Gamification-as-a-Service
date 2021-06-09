const renderPage = require("../../core/render");
const path = require("path");
const gamificationSystemRepository = require("../../repositories/GamificationSystemsRepository");
const GamificationReward = require("../../models/GamificationReward");
const errorRoute = require("../error");
const utils = require("../../internal/utils");
const {parse} = require('querystring');

const adminAddRewardPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newReward = new GamificationReward(
            parsedBody.id, parsedBody['api-key'], parsedBody.name, parsedBody.type, parsedBody.eventId,
            parsedBody['event-value'], parsedBody['reward-value']
        );

        let dbResult = null;
        await gamificationSystemRepository.addGamificationRewardToDatabase(newReward).then(function(result) {
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

        response.writeHead(302, {'Location': '/admin/gamification-rewards'});
        response.end();
    });
}

module.exports = adminAddRewardPOSTRoute;