const { parse } = require('querystring');

const utils = require('../internal/utils');
const gamificationSystemExternalServices = require('../services/gamificationSystemExternalServices');

/**
 * Rezolva un request de tip POST/PUT facut la pagina '/external/gamification_system' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemPOSTPUTRequest(request, response) {
    // Verific validitatea url-ului
    if(!request.url.startsWith('/external/gamification_system?')) {
        response.statusCode = 404; // 404 - Not Found
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid URL."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split('/external/gamification_system?')[1];
    var queryStringObject = parse(queryString);
    if(queryStringObject.apikey == null || queryStringObject.apikey.length == 0) {
        response.statusCode = 400; // 400 - Bad Request
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid Query String."
        });
        response.end(json);
        return;
    }

    // Citesc request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        // Parsez request body-ul
        parsedBody = parse(body);

        // Verific request body-ul
        if(parsedBody.userId == null || parsedBody.userId.length == 0 ||
                parsedBody.eventName == null || parsedBody.eventName.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            var json = JSON.stringify({
                status: "failed",
                message: "Not enough data in request body."
            });
            response.end(json);
            return;
        }

        // Introduc datele in baza de date
        var serviceResult = null;
        await gamificationSystemExternalServices.addGamificationUserDataToDatabase(
            queryStringObject.apikey, parsedBody.userId, parsedBody.eventName
        ).then(function (result) {
            serviceResult = result;
        });

        while(serviceResult == null) {
            await utils.timeout(10);
        }

        if(serviceResult == 1) {
            response.statusCode = 422; // 422 - Unprocessable Entity
            console.log(queryStringObject.apikey)
            var json = JSON.stringify({
                status: "failed",
                message: "Invalid API key/event name."
            });
            response.end(json);
            return;
        }

        if(serviceResult == -1) {
            response.statusCode = 500; // 500 - Internal Server Error
            var json = JSON.stringify({
                status: "failed"
            });
            response.end(json);
            return;
        }

        // Generez raspunsul
        var json = JSON.stringify({
            status: "success"
        });
        response.end(json);
        return;
    });

    return null;
}

module.exports = {handleExternalGamificationSystemPOSTPUTRequest};