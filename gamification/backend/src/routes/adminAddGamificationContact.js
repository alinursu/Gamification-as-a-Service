const renderPage = require("../core/render");
const path = require("path");

const adminAddGamificationContactRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/addGamificationContact.hbs')
    }
    return renderPage(paths.index, {styles: ['admin-add-gamification-contact']}, (data) => {
            response.write(data);
            response.end();
        }
    );
}

module.exports = adminAddGamificationContactRoute;