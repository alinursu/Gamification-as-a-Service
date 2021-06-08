const renderPage = require("../../core/render");
const path = require("path");
const User = require("../../models/User");
const usersRepository = require("../../repositories/UsersRepository");
const { parse } = require('querystring');

const adminAddUserPOSTRoute = (request, response) => {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        // Parsez request body-ul
        const parsedBody = parse(body);

        const newUser = new User(null, parsedBody.lname, parsedBody.fname, parsedBody.email, parsedBody.password, parsedBody.url);
        await usersRepository.insertUserModel(newUser)

        response.writeHead(302, {'Location': '/admin/users'});
        response.end();
    });
}

module.exports = adminAddUserPOSTRoute;