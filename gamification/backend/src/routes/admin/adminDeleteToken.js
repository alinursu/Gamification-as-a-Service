const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const tokensRepository = require("../../repositories/TokensRepository");
const utils = require("../../internal/utils");
const errorRoute = require("../error");

const adminDeleteTokenRoute = async (request, response) => {
    try {
        const queryString = request.url.split('?')[1];
        const queryObject = querystringParser.parse(queryString);

        request.token = queryObject.token;

        if (!request.token) {
            response.write("Bad URL");
            response.end();
            return;
        }

        // decode token
        request.token = decodeURIComponent(request.token);

        let dbResult = null;
        await tokensRepository.deleteToken(request.token).then(function(result) {
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

        response.writeHead(302, {'Location': '/admin/tokens'});
        response.end();
    } catch (error) {
        console.log(error)
        response.writeHead(302, {'Location': '/admin/tokens'});
        response.end();
    }
}

module.exports = adminDeleteTokenRoute;