const renderPage = require("../../core/render");
const path = require("path");
const Reward = require("../../models/GamificationReward");
const GamificationReward = require("../../repositories/GamificationSystemsRepository");
const {parse} = require('querystring');

const adminUpdateRewardPUTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul *care vine de la form (name din hbs)*
        const parsedBody = parse(body);

        const newReward = new Reward(parsedBody.id,parsedBody['api-key'], parsedBody.name, parsedBody.type, parsedBody.eventId, parsedBody['event-value'],parsedBody['reward-value']);
        await GamificationReward.updateRewardModel(newReward);

        response.writeHead(302, {'Location': '/admin/gamification-rewards'});
        response.end();
    });
}

module.exports = adminUpdateRewardPUTRoute;