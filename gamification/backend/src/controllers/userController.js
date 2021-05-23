const { parse } = require('querystring');

const UserModel = require('../models/User');
const loginRoute = require('../routes/login');

/**
 * Handles the POST request made on /login page.
 * @param {*} request The request.
 * @param {*} response The response given by the server.
 */
function handleLoginRequest(request, response) {
    // Reading request body
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', () => {
        // Parsing request body
        parsedBody = parse(body);

        // Creating the model
        let user = new UserModel(null, parsedBody.email, parsedBody.password);

        // Verifying data
        if(user.email.length == 0){
            request.errorMessage = "Campul adresei de email nu poate fi gol!";
            return loginRoute(request, response);
        }

        if(user.password.length == 0){
            request.errorMessage = "Campul parolei nu poate fi gol!";
            request.previousEmailValue = user.email;
            return loginRoute(request, response);
        }

        if(!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(user.email)) {
            request.errorMessage = "Adresa de email nu este valida!";
            request.previousEmailValue = user.email;
            return loginRoute(request, response);
        }

        // Verifying if the model appears in database
                                                                                            // TODO

        // TODO: Create appropiate response
        response.end('ok');
    });

    
    

    
}

module.exports = {handleLoginRequest};