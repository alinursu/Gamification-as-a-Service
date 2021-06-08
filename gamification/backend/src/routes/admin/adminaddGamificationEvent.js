const renderPage = require("../../core/render");
const path = require("path");

const adminAddGamificationEventRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/addGamificationEvent.hbs')
    }
    return renderPage(paths.index, {styles: ['admin-add-gamification-event']}, (data) => {
            response.write(data);
            response.end();
        }
    );
}

module.exports = adminAddGamificationEventRoute;