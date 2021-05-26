const { parse } = require('querystring');

const ContactMessageModel = require('../models/ContactMessage');
const indexRoute = require('../routes/index');
const contactMessageRepository = require('../repositories/contactMessagesRepository');
const { verifyPresenceOfContactMessageCredentials, validateContactMessageCredentials } = require('../services/contactMessageServices');


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

        // Verific daca a fost o redirectionare catre pagina principala ("/")
        if(message.name == null && message.email == null && message.text == null) {
            return indexRoute(request, response);
        }

        // Verific datele
        var serviceResponse = verifyPresenceOfContactMessageCredentials(message, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Validez datele
        var serviceResponse = validateContactMessageCredentials(message, request, response);
        if(serviceResponse == 0) {
            return;
        }

        // Adaug modelul in baza de date
        contactMessageRepository.addContactMessageToDatabase(message);

        request.successMessage = "Mesajul a fost trimis cu succes!";
        return indexRoute(request, response);
    });    
}

module.exports = {handleContactRequest};