const renderPage = require("../../core/render");
const path = require("path");
const System = require("../../models/GamificationSystem");
const GamificationSystem = require("../../repositories/gamificationSystemsRepository");
const {parse} = require('querystring');

const adminUpdateSystemPUTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul *care vine de la form (name din hbs)*
        const parsedBody = parse(body);

        const newSystem = new System(parsedBody['api-key'], parsedBody.name, parsedBody.userId, null, null);
        await GamificationSystem.updateSystemModel(newSystem);

        response.writeHead(302, {'Location': '/admin/gamification-systems'});
        response.end();
    });
}

module.exports = adminUpdateSystemPUTRoute;