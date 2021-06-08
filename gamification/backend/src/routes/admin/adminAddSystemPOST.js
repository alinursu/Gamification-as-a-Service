const renderPage = require("../../core/render");
const path = require("path");
const gamificationSystemRepository = require("../../repositories/GamificationSystemsRepository");
const GamificationSystem = require("../../models/GamificationSystem");
const {parse} = require('querystring');

const adminAddSystemPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newSystem = new GamificationSystem(parsedBody['api-key'], parsedBody.name, parsedBody.userId, null, null);
        await gamificationSystemRepository.addGamificationSystemToDatabase(newSystem);

        response.writeHead(302, {'Location': '/admin/gamification-systems'});
        response.end();
    });
}

module.exports = adminAddSystemPOSTRoute;