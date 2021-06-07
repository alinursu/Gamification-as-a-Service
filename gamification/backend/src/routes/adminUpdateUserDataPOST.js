const renderPage = require("../core/render");
const path = require("path");
const UserData = require("../models/GamificationUserData");
const GamificationUserData = require("../repositories/GamificationSystemExternalRepository");
const {parse} = require('querystring');

const adminUpdateUserDataPUTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul *care vine de la form (name din hbs)*
        const parsedBody = parse(body);

        const newUserData = new UserData(parsedBody['system-api-key'], parsedBody.userId, parsedBody.rewardId, parsedBody.progress);
        await GamificationUserData.updateUserData(newUserData);

        response.writeHead(302, {'Location': '/admin/user-data'});
        response.end();
    });
}

module.exports = adminUpdateUserDataPUTRoute;