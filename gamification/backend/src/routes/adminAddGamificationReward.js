const renderPage = require("../core/render");
const path = require("path");

const adminAddGamificationRewardRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/addGamificationReward.hbs')
    }
    return renderPage(paths.index, {styles: ['admin-add-gamification-reward']}, (data) => {
            response.write(data);
            response.end();
        }
    );
}

module.exports = adminAddGamificationRewardRoute;