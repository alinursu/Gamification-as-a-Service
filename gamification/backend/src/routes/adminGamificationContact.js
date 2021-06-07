const renderPage = require("../core/render");
const path = require("path");
const gamificationContactRepository = require("../repositories/ContactMessagesRepository");

const adminGamificationContactRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/gamificationContact.hbs')
    }

    return renderPage(paths.index, {
        contacts: await gamificationContactRepository.getAllMessages(),
        styles: ['admin-gamification-contact']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminGamificationContactRoute;