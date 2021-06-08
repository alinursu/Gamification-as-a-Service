const renderPage = require("../../core/render");
const path = require("path");
const gamificationEventsRepository = require("../../repositories/GamificationSystemsRepository");

const adminGamificationEventsRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/gamificationEvents.hbs')
    }

    return renderPage(paths.index, {
        events: await gamificationEventsRepository.getAllEvents(),
        styles: ['admin-gamification-events']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminGamificationEventsRoute;