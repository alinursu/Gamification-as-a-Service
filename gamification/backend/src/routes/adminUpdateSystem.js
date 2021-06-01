const renderPage = require("../core/render");
const path = require("path");
const querystringParser = require("querystring");
const gamificationSystemRepository = require("../repositories/gamificationSystemsRepository");

const adminUpdateSystemRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/updateSystem.hbs')
    }

    const queryString = request.url.split('?')[1];
    const queryObject = querystringParser.parse(queryString);

    try {
        if (!queryObject.api_key) {
            request.system = null;
        } else {
            request.api_key = decodeURIComponent(request.api_key);
            request.system = await gamificationSystemRepository.getGamificationSystemByApiKey(queryObject.api_key);
        }
    } catch (error) {
        console.log(error);
        request.system = null;
    }

    return renderPage(paths.index, {system: request.system, styles: ['admin-update']}, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUpdateSystemRoute;