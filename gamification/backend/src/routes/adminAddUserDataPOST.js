const renderPage = require("../core/render");
const path = require("path");
const UserData = require("../models/GamificationUserData");
const userDataRepository = require("../repositories/gamificationSystemExternalRepository");
const { parse } = require('querystring');

const adminAddUserDataPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newUserData = new UserData(parsedBody['system-api-key'], parsedBody.userId, parsedBody.rewardId, parsedBody.progress);
        await userDataRepository.insertGamificationUserData(newUserData)

        response.writeHead(302, {'Location': '/admin/user-data'});
        response.end();
    });
}

module.exports = adminAddUserDataPOSTRoute;