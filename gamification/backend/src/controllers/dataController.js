const ContactMessageServices = require("../services/contactMessageServices");
const GamificationSystemServices = require("../services/gamificationSystemServices");
const UsersService = require("../services/userServices");
const TokensServices = require("../services/tokensServices");
const GamificationSystemExternalServices = require("../services/gamificationSystemExternalServices");
const DataServices = require("../services/dataServices");

const utils = require("../internal/utils");

const errorRoute = require("../routes/error");

const {Parser} = require('json2csv');
const formidable = require('formidable');
const fs = require('fs');


/**
 * Rezolva un request de tip GET facut la ruta '/admin/contact-messages/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleContactMessagesExportRequest(request, response) {
    // Preiau din baza de date modelele ContactMessage
    var serviceResult = null;
    await ContactMessageServices.getAllMessages().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
       'Content-Disposition': 'attachment;filename=Exported-Contact-Messages.csv'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip POST facut la ruta '/admin/gamification-systems/import'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleImportContactMessagesRequest(request, response) {
    var form = new formidable.IncomingForm();

    // Parsez continutul fisierului importat
    form.parse(request, function(error, fields, files) {
        fs.readFile(files['imported-CSV-file'].path, async function(error, data) {
            // Formatez buffer-ul
            let lines = data.toString().replace(/\r/g, '').split('\n').filter(
                line => line.length > 0
            );

            if(lines.length < 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține suficiente date.";
                return errorRoute(request, response);
            }

            // Verific header-ul fisierului CSV
            const headerContent = lines[0].split(',');
            if(!headerContent.includes('name') || !headerContent.includes('email') || !headerContent.includes('text')) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține datele necesare pentru importarea mesajelor de contact.";
                return errorRoute(request, response);
            }

            let serviceResult = null;
            await DataServices.addImportedContactMessages(lines).then(function(result) {
                serviceResult = result;
            })

            while(serviceResult == null) {
                await utils.timeout(10);
            }

            if(serviceResult === 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat conține linii cu prea multe sau prea puține date.";
                return errorRoute(request, response);
            }

            if(serviceResult === 20) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Există cel puțin o linie în fișier care conține o cheie API deja folosită.";
                return errorRoute(request, response);
            }

            if(serviceResult === -1) { // Database error
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                    "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                return errorRoute(request, response);
            }

            // Redirectionez catre pagina '/admin/gamification-systems' - 303 See Other
            response.writeHead(303, {'Location': '/admin/contact'});
            response.end();
        })
    });
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/gamification-systems/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleGamificationSystemsExport(request, response) {
    // Preiau din baza de date modelele GamificationSystem
    var serviceResult = null;
    await GamificationSystemServices.getAllGamificationSystems().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
        'Content-Disposition': 'attachment;filename=Exported-Gamification-Systems.csv'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip POST facut la ruta '/admin/gamification-systems/import'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleImportGamificationSystemsRequest(request, response) {
    var form = new formidable.IncomingForm();

    // Parsez continutul fisierului importat
    form.parse(request, function(error, fields, files) {
        fs.readFile(files['imported-CSV-file'].path, async function(error, data) {
            // Formatez buffer-ul
            let lines = data.toString().replace(/\r/g, '').split('\n').filter(
                line => line.length > 0
            );

            if(lines.length < 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține suficiente date.";
                return errorRoute(request, response);
            }

            // Verific header-ul fisierului CSV
            const headerContent = lines[0].split(',');
            if(!headerContent.includes('APIKey') || !headerContent.includes('name') || !headerContent.includes('userId')) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține datele necesare pentru importarea sistemelor de gamificare.";
                return errorRoute(request, response);
            }

            let serviceResult = null;
            await DataServices.addImportedGamificationSystems(lines).then(function(result) {
                serviceResult = result;
            })

            while(serviceResult == null) {
                await utils.timeout(10);
            }

            if(serviceResult === 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat conține linii cu prea multe sau prea puține date.";
                return errorRoute(request, response);
            }

            if(serviceResult === 20) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Există cel puțin o linie în fișier care conține o cheie API deja folosită.";
                return errorRoute(request, response);
            }

            if(serviceResult === -1) { // Database error
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                    "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                return errorRoute(request, response);
            }

            // Redirectionez catre pagina '/admin/gamification-systems' - 303 See Other
            response.writeHead(303, {'Location': '/admin/gamification-systems'});
            response.end();
        })
    });
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/gamification-rewards/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportGamificationRewardsRequest(request, response) {
    // Preiau din baza de date modelele GamificationReward
    var serviceResult = null;
    await GamificationSystemServices.getAllGamificationReward().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
        'Content-Disposition': 'attachment;filename=Exported-Gamification-Rewards.csv'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip POST facut la ruta '/admin/gamification-rewards/import'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleImportGamificationRewardsRequest(request, response) {
    var form = new formidable.IncomingForm();

    // Parsez continutul fisierului importat
    form.parse(request, function(error, fields, files) {
        fs.readFile(files['imported-CSV-file'].path, async function(error, data) {
            // Formatez buffer-ul
            let lines = data.toString().replace(/\r/g, '').split('\n').filter(
                line => line.length > 0
            );

            if(lines.length < 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține suficiente date.";
                return errorRoute(request, response);
            }

            // Verific header-ul fisierului CSV
            const headerContent = lines[0].split(',');
            if(!headerContent.includes('systemAPIKey') || !headerContent.includes('name') || !headerContent.includes('type') ||
                    !headerContent.includes('eventId') || !headerContent.includes('eventValue') || !headerContent.includes('rewardValue')) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține datele necesare pentru importarea recompenselor unor sisteme de gamificare.";
                return errorRoute(request, response);
            }

            let serviceResult = null;
            await DataServices.addImportedGamificationRewards(lines).then(function(result) {
                serviceResult = result;
            })

            while(serviceResult == null) {
                await utils.timeout(10);
            }

            if(serviceResult === 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat conține linii cu prea multe sau prea puține date.";
                return errorRoute(request, response);
            }

            if(serviceResult === -1) { // Database error
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                    "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                return errorRoute(request, response);
            }

            // Redirectionez catre pagina '/admin/gamification-rewards' - 303 See Other
            response.writeHead(303, {'Location': '/admin/gamification-rewards'});
            response.end();
        })
    });
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/gamification-events/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportGamificationEventsRequest(request, response) {
    // Preiau din baza de date modelele GamificationEvent
    var serviceResult = null;
    await GamificationSystemServices.getAllGamificationEvent().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
        'Content-Disposition': 'attachment;filename=Exported-Gamification-Events.csv'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip POST facut la ruta '/admin/gamification-events/import'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleImportGamificationEventsRequest(request, response) {
    var form = new formidable.IncomingForm();

    // Parsez continutul fisierului importat
    form.parse(request, function(error, fields, files) {
        fs.readFile(files['imported-CSV-file'].path, async function(error, data) {
            // Formatez buffer-ul
            let lines = data.toString().replace(/\r/g, '').split('\n').filter(
                line => line.length > 0
            );

            if(lines.length < 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține suficiente date.";
                return errorRoute(request, response);
            }

            // Verific header-ul fisierului CSV
            const headerContent = lines[0].split(',');
            if(!headerContent.includes('systemAPIKey') || !headerContent.includes('name') || !headerContent.includes('eventType')) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține datele necesare pentru importarea evenimentelor unor sisteme de gamificare.";
                return errorRoute(request, response);
            }

            let serviceResult = null;
            await DataServices.addImportedGamificationEvents(lines).then(function(result) {
                serviceResult = result;
            })

            while(serviceResult == null) {
                await utils.timeout(10);
            }

            if(serviceResult === 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat conține linii cu prea multe sau prea puține date.";
                return errorRoute(request, response);
            }

            if(serviceResult === -1) { // Database error
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                    "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                return errorRoute(request, response);
            }

            // Redirectionez catre pagina '/admin/gamification-events' - 303 See Other
            response.writeHead(303, {'Location': '/admin/gamification-events'});
            response.end();
        })
    });
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/users/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportUsersRequest(request, response) {
    // Preiau din baza de date modelele User
    var serviceResult = null;
    await UsersService.getAllUsers().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
        'Content-Disposition': 'attachment;filename=Exported-Users.csv'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip POST facut la ruta '/admin/users/import'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleImportUsersRequest(request, response) {
    var form = new formidable.IncomingForm();

    // Parsez continutul fisierului importat
    form.parse(request, function(error, fields, files) {
        fs.readFile(files['imported-CSV-file'].path, async function(error, data) {
            // Formatez buffer-ul
            let lines = data.toString().replace(/\r/g, '').split('\n').filter(
                line => line.length > 0
            );

            if(lines.length < 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține suficiente date.";
                return errorRoute(request, response);
            }

            // Verific header-ul fisierului CSV
            const headerContent = lines[0].split(',');
            if(!headerContent.includes('lastname') || !headerContent.includes('firstname') || !headerContent.includes('email') ||
                    !headerContent.includes('password') || !headerContent.includes('url') || !headerContent.includes("isAdmin")) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat nu conține datele necesare pentru importarea utilizatorilor.";
                return errorRoute(request, response);
            }

            let serviceResult = null;
            await DataServices.addImportedUsers(lines).then(function(result) {
                serviceResult = result;
            })

            while(serviceResult == null) {
                await utils.timeout(10);
            }

            if(serviceResult === 1) {
                response.statusCode = 422;
                request.statusCodeMessage = "Unprocessable Entity";
                request.errorMessage = "Fișierul încărcat conține linii cu prea multe sau prea puține date.";
                return errorRoute(request, response);
            }

            if(serviceResult === -1) { // Database error
                // Creez un raspuns, instiintand utilizatorul de eroare
                response.statusCode = 500;
                request.statusCodeMessage = "Internal Server Error";
                request.errorMessage = "A apărut o eroare pe parcursul procesării cererii tale! Încearcă din nou mai târziu, iar dacă problema " +
                    "persistă, te rog să ne contactezi folosind formularul de pe pagina principală.";
                return errorRoute(request, response);
            }

            // Redirectionez catre pagina '/admin/users' - 303 See Other
            response.writeHead(303, {'Location': '/admin/users'});
            response.end();
        })
    });
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/tokens/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportTokensRequest(request, response) {
    // Preiau din baza de date modelele GamificationEvent
    var serviceResult = null;
    await TokensServices.getAllTokens().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
        'Content-Disposition': 'attachment;filename=Exported-Tokens.csv'
    });
    response.end(formattedData);
}

/**
 * Rezolva un request de tip GET facut la ruta '/admin/user-data/export'.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function handleExportGamificationUserDataRequest(request, response) {
    // Preiau din baza de date modelele GamificationUserData
    var serviceResult = null;
    await GamificationSystemExternalServices.getGamificationUserDatas().then(function (result) {
        serviceResult = result;
    });

    while(serviceResult == null) {
        await utils.timeout(10);
    }

    if(serviceResult === -1) { // Database error
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
        'Content-Disposition': 'attachment;filename=Exported-Contact-Messages.csv'
    });
    response.end(formattedData);
}


module.exports = {handleContactMessagesExportRequest, handleGamificationSystemsExport,
    handleExportGamificationRewardsRequest, handleExportUsersRequest, handleExportGamificationEventsRequest,
    handleExportTokensRequest, handleImportUsersRequest, handleImportGamificationSystemsRequest,
    handleImportGamificationEventsRequest, handleImportGamificationRewardsRequest,
    handleExportGamificationUserDataRequest, handleImportContactMessagesRequest};