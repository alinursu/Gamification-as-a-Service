const renderPage = require("../core/render");
const path = require("path");
const gamificationSystemRepository = require("../repositories/GamificationSystemsRepository");
const GamificationReward = require("../models/GamificationReward");
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

        const newReward = new GamificationReward(parsedBody.id, parsedBody['api-key'], parsedBody.name, parsedBody.type, parsedBody.eventId, parsedBody['event-value'], parsedBody['reward-value']);
        await gamificationSystemRepository.addGamificationRewardToDatabase(newReward);

        response.writeHead(302, {'Location': '/admin/gamification-rewards'});
        response.end();
    });
}

module.exports = adminAddRewardPOSTRoute;