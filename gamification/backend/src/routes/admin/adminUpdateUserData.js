const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require("querystring");
const gamificationUserDataRepository = require("../../repositories/gamificationSystemExternalRepository");

const adminUpdateUserDataRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/updateUserData.hbs')
    }

    const queryString = request.url.split('?')[1];
    const queryObject = querystringParser.parse(queryString);

    try {
        if (!queryObject.api_key) {
            request.api_key = null;
        } else {
            request.api_key = queryObject.api_key
            const users =  await gamificationUserDataRepository.getUserDataByAPIKey(request.api_key);
            request.userData = users.find(record => record.user_id === queryObject.user_id);
        }
    } catch (error) {
        console.log(error);
        request.event = null;
    }

    return renderPage(paths.index, {userData: request.userData, styles: ['admin-update']}, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUpdateUserDataRoute;