const { parse } = require('querystring');
var cookie = require('cookie');

const gamificationSystemServices = require('../services/gamificationSystemServices');
const gamificationSystemsRepository = require('../repositories/gamificationSystemsRepository');
const gamificationSystemExternalServices = require('../services/gamificationSystemExternalServices');
const utils = require('../internal/utils');
const formRoute = require('../routes/form');
const errorRoute = require('../routes/error');
const formViewRoute = require('../routes/formView');
const formModifyRoute = require('../routes/formModify');
const formDeleteRoute = require('../routes/formDelete');
const userController = require('../controllers/userController');

/**
 * Rezolva un request de tip POST facut la pagina '/profile/create-gamifcation-system'.
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
        await gamificationSystemServices.createModelFromRequestBodyData(parsedBody, token, formRoute, request, response).then(function (result) {
            gamificationSystemModel = result;
        })

        while(gamificationSystemModel == 0) {
            await utils.timeout(10);
        }

        if(gamificationSystemModel == null) {
            return;
        }

        // Adaug modelul in baza de date
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
                
                for(var index=0; index < gamificationSystemModel.listOfGamificationEvents.length; index++) {
                    gamificationSystemModel.listOfGamificationEvents[index].id = index+1;
                }
            
                for(var index=0; index < gamificationSystemModel.listOfGamificationRewards.length; index++) {
                    gamificationSystemModel.listOfGamificationRewards[index].id = index+1;
                }

                request.gamificationSystemModel = gamificationSystemModel;
                formRoute(request, response);
                return;
            }

            default: {
                // Redirectionez utilizatorul
                response.writeHead(303, 
                    {'Location': '/profile'}
                ); // 303 - See Other
                response.end();
            }
        }
    });
}

/**
 * Rezolva un request de tip GET facut la pagina '/profile/view-gamification-system', '/profile/modify-gamification-system' sau '/profile/delete-gamification-system'.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 * @param {*} urlPrefix Prefixul url-ului ('/profile/view-gamification-system', '/profile/modify-gamification-system' sau '/profile/delete-gamification-system').
 */
async function handleViewGamificationSystemRequest(request, response, urlPrefix) {
    var cookies = cookie.parse(request.headers.cookie || '');
    var token = cookies.authToken;

    // Verific validitatea url-ului
    if(!request.url.startsWith(urlPrefix + '?')) {
        response.statusCode = 404;
        request.statusCodeMessage = "Not Found";
        request.errorMessage = "Nu am găsit pagina pe care încerci să o accesezi!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split(urlPrefix + '?')[1];
    var queryStringObject = parse(queryString);
    if(queryStringObject.systemName == null || queryStringObject.systemName.length == 0) {
        response.statusCode = 400;
        request.statusCodeMessage = "Bad Request";
        request.errorMessage = "Cererea făcută nu poate fi procesată deoarece nu conține destule date sau datele sunt invalide!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    // Preiau modelul User folosindu-ma de token
    var userModel = -1;
    await userController.getUserModelByToken(token, request, response).then(function (result) {
        userModel = result;
    });

    while(userModel == -1) {
        await utils.timeout(10);
    }

    if(userModel == null) {
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    // Preiau sistemul de gamificare folosindu-ma de id-ul utilizatorului si de systemName
    var listOfGamificationSystemModel = null;
    await gamificationSystemServices.getGamificationSystemModelsByUserId(userModel.id).then(function (result) {
        listOfGamificationSystemModel = result;
    });

    while(listOfGamificationSystemModel == null) {
        await utils.timeout(10);
    }

    if(listOfGamificationSystemModel == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
        "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    var gamificationSystemModel = listOfGamificationSystemModel.filter(model => model.name == queryStringObject.systemName);
    if(gamificationSystemModel.length == 0) {
        response.statusCode = 404;
        request.statusCodeMessage = "Not Found";
        request.errorMessage = "Nu am găsit sistemul de gamificație pe care încerci să îl accesezi!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }
    gamificationSystemModel = gamificationSystemModel[0];

    // Formatez modelul
    var rewardIds = []
    for(var i=0; i<gamificationSystemModel.listOfGamificationRewards.length; i++) {
        rewardIds.push(gamificationSystemModel.listOfGamificationRewards[i].id);
        gamificationSystemModel.listOfGamificationRewards[i].id = i+1;
        var eventModelsFiltered = gamificationSystemModel.listOfGamificationEvents.filter(
            eventModel => eventModel.id == gamificationSystemModel.listOfGamificationRewards[i].eventId
        );

        gamificationSystemModel.listOfGamificationRewards[i].eventId = eventModelsFiltered[0].name;
    }

    var eventIds = []
    for(var i=0; i<gamificationSystemModel.listOfGamificationEvents.length; i++) {
        eventIds.push(gamificationSystemModel.listOfGamificationEvents[i].id);
        gamificationSystemModel.listOfGamificationEvents[i].id = i+1;
    }

    // Generez pagina de vizualizare
    request.gamificationSystemModel = gamificationSystemModel;
    request.rewardModelIds = rewardIds;
    request.eventModelIds = eventIds;
    switch(urlPrefix) {
        case '/profile/view-gamification-system': {
            return formViewRoute(request, response);
        }

        case '/profile/modify-gamification-system': {
            return formModifyRoute(request, response);
        }

        case '/profile/delete-gamification-system': {
            return formDeleteRoute(request, response);
        }
    }
}

/**
 * Rezolva un request de tip POST/PUT facut la pagina '/profile/modify-gamification-system'.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
async function handleModifyGamificationSystemRequest(request, response) {
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

        // Preiau modelul User folosindu-ma de token
        var userModel = -1;
        await userController.getUserModelByToken(token, request, response).then(function (result) {
            userModel = result;
        });

        while(userModel == -1) {
            await utils.timeout(10);
        }

        if(userModel == null) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Preiau sistemele de gamificatie ale utilizatorului
        var userGamificationSystems = null;
        await gamificationSystemsRepository.getGamificationSystemsByUserId(userModel.id).then(function (result) {
            userGamificationSystems = result;
        });

        while(userGamificationSystems == null) {
            await utils.timeout(10);   
        }

        if(userGamificationSystems == -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Verific validitatea cheii API (daca are un sistem de gamification cu aceasta cheie)
        var result = userGamificationSystems.filter(gamificationSystem => gamificationSystem.api_key == parsedBody.system_apikey);

        if(result.length == 0) {
            response.statusCode = 400;
            request.statusCodeMessage = "Bad Request";
            request.errorMessage = "Nu am găsit niciun sistem de recompense cu această cheie API asociată contului dumneavoastră.";
            errorRoute(request, response);
            return;
        }

        // Creez modelul Gamification System
        var gamificationSystemModel = 0;
        await gamificationSystemServices.createModelFromRequestBodyData(parsedBody, token, 
            formModifyRoute, request, response, parsedBody.system_apikey
        ).then(function (result) {
            gamificationSystemModel = result;
        });

        while(gamificationSystemModel == 0) {
            await utils.timeout(10);
        }

        if(gamificationSystemModel == null) { 
            return;
        }

        // Sterg modelul deja stocat in baza de date folosind api key-ul
        var dbResult = null;
        await gamificationSystemServices.deleteGamificationSystemModelByAPIKey(gamificationSystemModel.APIKey)
                .then(function(result) {
            dbResult = result;
        });
        
        while(dbResult == null) {
            await utils.timeout(10);
        }

        if(dbResult == -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Inserez modelul nou in baza de date 
        var dbResult = null;
        await gamificationSystemServices.addGamificationSystemModelToDatabase(gamificationSystemModel, parsedBody.system_apikey).then(function (result) {
            dbResult = result;
        });

        while(dbResult == null) {
            await utils.timeout(10);
        }

        if(dbResult == -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Redirectionez utilizatorul
        response.writeHead(303, 
            {'Location': '/profile/view-gamification-system?systemName=' + gamificationSystemModel.name}
        ); // 303 - See Other
        response.end();
    });

    return null;
}

/**
 * Rezolva un request de tip POST/DELETE facut la pagina '/profile/modify-gamification-system'.
 * @param {*} request Request-ul facut.
 * @param {*} response Raspunsul dat de server.
 */
async function handleDeleteGamificationSystemRequest(request, response) {
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

        // Preiau modelul User folosindu-ma de token
        var userModel = -1;
        await userController.getUserModelByToken(token, request, response).then(function (result) {
            userModel = result;
        });

        while(userModel == -1) {
            await utils.timeout(10);
        }

        if(userModel == null) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Preiau sistemele de gamificatie ale utilizatorului
        var userGamificationSystems = null;
        await gamificationSystemsRepository.getGamificationSystemsByUserId(userModel.id).then(function (result) {
            userGamificationSystems = result;
        });

        while(userGamificationSystems == null) {
            await utils.timeout(10);   
        }

        if(userGamificationSystems == -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Verific validitatea cheii API (daca are un sistem de gamification cu aceasta cheie)
        var result = userGamificationSystems.filter(gamificationSystem => gamificationSystem.api_key == parsedBody.system_apikey);

        if(result.length == 0) {
            response.statusCode = 400;
            request.statusCodeMessage = "Bad Request";
            request.errorMessage = "Nu am găsit niciun sistem de recompense cu această cheie API asociată contului dumneavoastră.";
            errorRoute(request, response);
            return;
        }

        // Sterg modelul deja stocat in baza de date folosind api key-ul
        var dbResult = null;
        await gamificationSystemServices.deleteGamificationSystemModelByAPIKey(parsedBody.system_apikey)
                .then(function(result) {
            dbResult = result;
        });
        
        while(dbResult == null) {
            await utils.timeout(10);
        }

        if(dbResult == -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Sterg datele asociate cheii API din tabela 'gamification-user-data'
        var dbResult = null;
        await gamificationSystemExternalServices.deleteGamificationUserDataByAPIKey(parsedBody.system_apikey).then(function (result) {
            dbResult = result;
        });

        while(dbResult == null) {
            await utils.timeout(10);
        }

        if(dbResult == -1) { // Database error
            // Creez un raspuns, instiintand utilizatorul de eroare
            response.statusCode = 500;
            request.statusCodeMessage = "Internal Server Error";
            request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " + 
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
            errorRoute(request, response);
            return;
        }

        // Redirectionez utilizatorul
        response.writeHead(303, 
            {'Location': '/profile'}
        ); // 303 - See Other
        response.end();
    });

    return null;
}

module.exports = {handleCreateGamificationSystemRequest, handleViewGamificationSystemRequest, handleModifyGamificationSystemRequest,
    handleDeleteGamificationSystemRequest}