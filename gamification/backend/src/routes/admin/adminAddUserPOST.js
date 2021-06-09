const renderPage = require("../../core/render");
const path = require("path");
const User = require("../../models/User");
const usersRepository = require("../../repositories/UsersRepository");
const utils = require("../../internal/utils");
const errorRoute = require("../error");
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

        let dbResult = null;
        await usersRepository.insertUserModel(newUser).then(function(result) {
            dbResult = result;
        })

        while(dbResult == null) {
            await utils.timeout(10);
        }

        if(dbResult === -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            return errorRoute(request, response);
        }

        response.writeHead(302, {'Location': '/admin/users'});
        response.end();
    });
}

module.exports = adminAddUserPOSTRoute;