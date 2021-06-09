const renderPage = require("../../core/render");
const path = require("path");
const UserData = require("../../models/GamificationUserData");
const userDataRepository = require("../../repositories/GamificationSystemExternalRepository");
const utils = require("../../internal/utils");
const errorRoute = require("../error");
const { parse } = require('querystring');

const adminAddUserDataPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newUserData = new UserData(parsedBody['system-api-key'], parsedBody.userId, parsedBody.rewardId, parsedBody.progress);

        let dbResult = null;
        await userDataRepository.insertGamificationUserData(newUserData).then(function(result) {
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

        response.writeHead(302, {'Location': '/admin/user-data'});
        response.end();
    });
}

module.exports = adminAddUserDataPOSTRoute;