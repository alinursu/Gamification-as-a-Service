const renderPage = require("../core/render");
const path = require("path");
const querystringParser = require('querystring');
const url = require("url");
const gamificationRewardsRepository = require("../repositories/gamificationSystemsRepository");

const adminDeleteRewardRoute = async (request, response) => {
    try {
        const queryString = request.url.split('?')[1];
        const queryObject = querystringParser.parse(queryString);

        request.id = queryObject.id;

        if (!request.id) {
            response.write("Bad URL");
            response.end();
            return;
        }

        await gamificationRewardsRepository.deleteRewardById(request.id);
        response.writeHead(302, {'Location': '/admin/gamification-rewards'});
        response.end();
    } catch (error) {
        console.log(error);
        response.writeHead(302, {'Location': '/admin/gamification-rewards'});
        response.end();
    }
}

module.exports = adminDeleteRewardRoute;