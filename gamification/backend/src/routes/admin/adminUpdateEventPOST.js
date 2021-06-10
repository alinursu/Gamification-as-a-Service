const renderPage = require("../../core/render");
const path = require("path");
const Event = require("../../models/GamificationEvent");
const GamificationEvent = require("../../repositories/gamificationSystemsRepository");
const {parse} = require('querystring');

const adminUpdateEventPUTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul *care vine de la form (name din hbs)*
        const parsedBody = parse(body);

        const newEvent = new Event(parsedBody.id, parsedBody['system-api-key'], parsedBody.name, parsedBody.type);
        await GamificationEvent.updateEventModel(newEvent);

        response.writeHead(302, {'Location': '/admin/gamification-events'});
        response.end();
    });
}

module.exports = adminUpdateEventPUTRoute;