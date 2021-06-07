const renderPage = require("../core/render");
const path = require("path");
const gamificationSystemRepository = require("../repositories/GamificationSystemsRepository");
const GamificationEvent = require("../models/GamificationEvent");
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
        await gamificationSystemRepository.addGamificationEventToDatabase(newEvent);

        response.writeHead(302, {'Location': '/admin/gamification-events'});
        response.end();
    });
}

module.exports = adminAddEventPOSTRoute;