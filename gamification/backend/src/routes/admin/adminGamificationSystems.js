const renderPage = require("../../core/render");
const path = require("path");
const gamificationSystemsRepository = require("../../repositories/gamificationSystemsRepository");

const adminGamificationSystemsRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/gamificationSystems.hbs')
    }

    return renderPage(paths.index, {
        systems: await gamificationSystemsRepository.getAllSystems(),
        styles: ['admin-gamification-systems']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminGamificationSystemsRoute;