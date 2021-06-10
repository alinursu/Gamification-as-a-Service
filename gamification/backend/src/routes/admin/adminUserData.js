const renderPage = require("../../core/render");
const path = require("path");
const userDataRepository = require("../../repositories/gamificationSystemExternalRepository");

const adminUserDataRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/gamificationUserData.hbs')
    }

    return renderPage(paths.index, {
        data: await userDataRepository.getAllGamificationUserData(),
        styles: ['admin-user-data']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUserDataRoute;