const { parse } = require('querystring');

const ContactMessageModel = require('../models/ContactMessage');
const indexRoute = require('../routes/index');
const errorRoute = require('../routes/error');

/**
 * Rezolva un request de tip POST facut in pagina /.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleContactRequest(request, response) {
    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Creez modelul
        let message = new ContactMessageModel(null, parsedBody.contact_name, parsedBody.contact_email, parsedBody.contact_message);

        // Verific datele
        if(message.name == null || message.email == null || message.text == null){
            response.statusCode = 400;
            request.statusCodeMessage = "Bad Request";
            request.errorMessage = "Request-ul de tip POST primit la pagina / nu este unul valid!";
            return errorRoute(request, response);
        }

        if(message.name.length == 0){
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Campul numelui nu poate fi gol!";
            return indexRoute(request, response);
        }

        if(message.email.length == 0){
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Campul adresei de email nu poate fi gol!";
            request.previousNameValue = message.name;
            return indexRoute(request, response);
        }

        if(message.text.length == 0){
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Campul mesajului nu poate fi gol!";
            request.previousNameValue = message.name;
            request.previousEmailValue = message.email;
            return indexRoute(request, response);
        }

        if(!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(message.email)) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Adresa de email nu este valida!";
            request.previousNameValue = message.name;
            request.previousEmailValue = message.email;
            request.previousTextValue = message.text;
            return indexRoute(request, response);
        }

        // Adaug modelul in baza de date
                                                                                            // TODO

        // TODO: Create appropiate response
        response.end('ok');
    });    
}

module.exports = {handleContactRequest};