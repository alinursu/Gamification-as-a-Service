const renderPage = require("../core/render");
const path = require("path");
const User = require("../models/User");
const usersRepository = require("../repositories/UsersRepository");
const { parse } = require('querystring');

const adminUpdateUserPUTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newUser = new User(parsedBody.id, parsedBody.lname, parsedBody.fname, parsedBody.email,null, parsedBody.url);
        await usersRepository.updateUserModel(newUser);

        response.writeHead(302, {'Location': '/admin/users'});
        response.end();
    });
}

module.exports = adminUpdateUserPUTRoute;