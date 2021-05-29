const { parse } = require('querystring');
var cookie = require('cookie');

const gamificationSystemServices = require('../services/gamificationSystemServices');
const utils = require('../internal/utils');
const formRoute = require('../routes/form');
const errorRoute = require('../routes/error');

/**
 * Rezolva un request de tip POST facut la pagina /profile/create_gamifcation_system.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
function handleCreateGamificationSystemRequest(request, response) {
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

        // Creez modelul sistemului
        var gamificationSystemModel = 0;
        await gamificationSystemServices.createModelFromRequestBodyData(parsedBody, token, request, response).then(function (result) {
            gamificationSystemModel = result;
        })

        while(gamificationSystemModel == 0) {
            await utils.timeout(10);
        }

        if(gamificationSystemModel == null) {
            return;
        }

        // Adaug modelul in baza de date (Generez un api key si verific unicitatea numelui si a api key-ului)
        var serviceResponse = null;
        await gamificationSystemServices.addGamificationSystemModelToDatabase(gamificationSystemModel).then(function (result) {
            serviceResponse = result;
        });

        while(serviceResponse == null) {
            await utils.timeout(10);
        }

        switch(serviceResponse) {
            case -1: { // Database error
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
                "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                errorRoute(request, response);
                return;
            }

            case 1: {
                response.statusCode = 401; // 401 - Unauthorized
                request.errorMessage = "Există un sistem de recompense creat de dumneavoastră cu acest nume! Folosiți altul.";
                formRoute(request, response);
                return;
            }

            default: {
                // TODO: Pagina noua, cu putine informatii (in stilul error.hbs), in care sa se explice sumar urmatorii pasi, in care este
                //afisata cheia API generata (memorata in serviceResponse) si care contine un link catre '/documentation'
                response.statusCode = 201; // 201 - Created
                request.successMessage = "Sistemul de recompense a fost creat cu succes! Cheia API este: " + serviceResponse;
                formRoute(request, response);
                return;
            }
        }
    });
}

module.exports = {handleCreateGamificationSystemRequest}