const ContactMessageModel = require('../models/ContactMessage');
const indexRoute = require('../routes/index');
const errorRoute = require('../routes/error');

/**
 * Verifica daca am primit destule informatii pentru a putea procesa in continuare cererea de trimitere a unui mesaj. Daca nu am primit, va construi raspunsul.
 * @param {*} contactMessageModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca am primit destule informatii; 0, altfel
 */
 function verifyPresenceOfContactMessageCredentials(contactMessageModel, request, response) {
    if(contactMessageModel.name == null || contactMessageModel.email == null || contactMessageModel.text == null){
        response.statusCode = 400;
        request.statusCodeMessage = "Bad Request";
        request.errorMessage = "Request-ul de tip POST primit la pagina \"/\" nu este unul valid!";
        errorRoute(request, response);
        return 0;
    }

    if(contactMessageModel.name.length == 0){
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Campul numelui nu poate fi gol!";
        request.previousNameValue = contactMessageModel.name;
        request.previousEmailValue = contactMessageModel.email;
        request.previousTextValue = contactMessageModel.text;
        indexRoute(request, response);
        return 0;
    }

    if(contactMessageModel.email.length == 0){
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Campul adresei de email nu poate fi gol!";
        request.previousNameValue = contactMessageModel.name;
        request.previousEmailValue = contactMessageModel.email;
        request.previousTextValue = contactMessageModel.text;
        indexRoute(request, response);
        return 0;
    }

    if(contactMessageModel.text.length == 0){
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Campul mesajului nu poate fi gol!";
        request.previousNameValue = contactMessageModel.name;
        request.previousEmailValue = contactMessageModel.email;
        request.previousTextValue = contactMessageModel.text;
        indexRoute(request, response);
        return 0;
    }

    return 1;
}

/**
 * Verifica daca datele primite de la client pentru cererea de trimitere a unui mesaj. sunt valide. Daca nu sunt, va construi raspunsul.
 * @param {*} contactMessageModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca datele sunt valide; 0, altfel
 */
function validateContactMessageCredentials(contactMessageModel, request, response) {
    if(!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(contactMessageModel.email)) {
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Adresa de email nu este valida!";
        request.previousNameValue = contactMessageModel.name;
        request.previousEmailValue = contactMessageModel.email;
        request.previousTextValue = contactMessageModel.text;
        indexRoute(request, response);
        return 0;
    }

    return 1;
}

module.exports = {verifyPresenceOfContactMessageCredentials, validateContactMessageCredentials};