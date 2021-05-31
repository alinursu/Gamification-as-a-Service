const renderPage = require("../core/render");
const path = require("path");

const adminAddGamificationSystemRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/addGamificationSystem.hbs')
    }
    return renderPage(paths.index, {styles: ['admin-add-gamification-system']}, (data) => {
            response.write(data);
            response.end();
        }
    );
}

module.exports = adminAddGamificationSystemRoute;