const renderPage = require("../core/render");
const path = require("path");
const gamificationRewardsRepository = require("../repositories/gamificationSystemsRepository");

const adminGamificationEventsRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/gamificationEvents.hbs')
    }

    return renderPage(paths.index, {
        events: await gamificationRewardsRepository.getAllEvents(),
        styles: ['admin-gamification-events']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminGamificationEventsRoute;