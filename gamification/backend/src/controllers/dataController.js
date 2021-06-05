const contactMessageServices = require("../services/contactMessageServices");
const errorRoute = require("../routes/error");
const gamificationSystemServices = require("../services/gamificationSystemServices");
const usersService = require("../services/userServices");
const tokensServices = require("../services/tokensServices");

const {Parser} = require('json2csv');

/**
 * Rezolva un request de tip GET facut la ruta '/admin/contact-messages/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportContactMessagesRequest(request, response) {
    // Preiau din baza de date modelele ContactMessage
    var serviceResult = null;
    await contactMessageServices.getAllMessages().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    var parser = new Parser();
    var formattedData = parser.parse(serviceResult);

    response.writeHead(200, {
       'Content-Type': 'text/csv',
       'Content-Disposition': 'attachment;filename=Exported-Contact-Messages'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/gamification-systems/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleGamificationSystemsExport(request, response) {
    // Preiau din baza de date modelele GamificationSystem
    var serviceResult = null;
    await gamificationSystemServices.getAllGamificationSystems().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    let data = [];
    serviceResult.forEach(model => {
        data.push(new Object({
            'APIKey': model.APIKey,
            'name': model.name,
            'userId': model.userId
        }));
    });

    const parser = new Parser();
    var formattedData = parser.parse(data);

    response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment;filename=Exported-Gamification-Systems'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/gamification-rewards/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportGamificationRewardsRequest(request, response) {
    // Preiau din baza de date modelele GamificationReward
    var serviceResult = null;
    await gamificationSystemServices.getAllGamificationReward().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    var parser = new Parser();
    var formattedData = parser.parse(serviceResult);

    response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment;filename=Exported-Gamification-Rewards'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/gamification-events/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportGamificationEventsRequest(request, response) {
    // Preiau din baza de date modelele GamificationEvent
    var serviceResult = null;
    await gamificationSystemServices.getAllGamificationEvent().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    var parser = new Parser();
    var formattedData = parser.parse(serviceResult);

    response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment;filename=Exported-Gamification-Events'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/users/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportUsersRequest(request, response) {
    // Preiau din baza de date modelele User
    var serviceResult = null;
    await usersService.getAllUsers().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    var parser = new Parser();
    var formattedData = parser.parse(serviceResult);

    response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment;filename=Exported-Users'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/tokens/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportTokensRequest(request, response) {
    // Preiau din baza de date modelele GamificationEvent
    var serviceResult = null;
    await tokensServices.getAllTokens().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult == -1) { // Database error
        // Creez un raspuns, instiintand utilizatorul de eroare
        response.statusCode = 500;
        request.statusCodeMessage = "Internal Server Error";
        request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
            "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
        return errorRoute(request, response);
    }

    var parser = new Parser();
    var formattedData = parser.parse(serviceResult);

    response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment;filename=Exported-Tokens'
    });
    response.end(formattedData);
}

module.exports = {handleExportContactMessagesRequest, handleGamificationSystemsExport,
    handleExportGamificationRewardsRequest, handleExportUsersRequest, handleExportGamificationEventsRequest,
    handleExportTokensRequest};