const { parse } = require('querystring');
var cookie = require('cookie');

/**
 * Rezolva un request de tip POST facut la pagina /profile/create_gamifcation_system.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleNewGamificationSystemRequest(request, response) {
    var cookies = cookie.parse(request.headers.cookie || '');
    var token = cookies.authToken;

    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);
        console.log(parsedBody);

        // TODO: Creez modelul

        // TODO: Verific prezenta datelor

        // TODO: Validez datele

        // TODO: Preiau userId-ul din baza de date, folosindu-ma de token

        // TODO: Adaug modelul in baza de date

        // TODO: Afisez un mesaj corespunzator
    });
}

module.exports = {handleNewGamificationSystemRequest}