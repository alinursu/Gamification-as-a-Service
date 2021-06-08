const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require("querystring");
const gamificationSystemRepository = require("../../repositories/GamificationSystemsRepository");

const adminUpdateRewardRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/updateReward.hbs')
    }

    const queryString = request.url.split('?')[1];
    const queryObject = querystringParser.parse(queryString);

    try {
        if (!queryObject.id) {
            request.reward = null;
        } else {
            request.rewardId = queryObject.id
            request.reward = await gamificationSystemRepository.getGamificationRewardById(request.rewardId);
        }
    } catch (error) {
        console.log(error);
        request.reward = null;
    }

    return renderPage(paths.index, {reward: request.reward, styles: ['admin-update']}, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUpdateRewardRoute;