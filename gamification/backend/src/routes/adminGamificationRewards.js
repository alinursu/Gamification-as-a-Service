const renderPage = require("../core/render");
const path = require("path");
const gamificationRewardsRepository = require("../repositories/GamificationSystemsRepository");

const adminGamificationRewardsRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/gamificationRewards.hbs')
    }

    return renderPage(paths.index, {
        rewards: await gamificationRewardsRepository.getAllRewards(),
        styles: ['admin-gamification-rewards']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminGamificationRewardsRoute;