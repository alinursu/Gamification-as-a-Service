const { parse } = require('querystring');

const utils = require('../internal/utils');
const gamificationSystemExternalServices = require('../services/gamificationSystemExternalServices');
const gamificationSystemServices = require('../services/gamificationSystemServices');

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

/**
 * Rezolva un request de tip GET facut la pagina '/external/gamification_system' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemGETRequest(request, response) {    
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

    // Citesc si parsez request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        parsedBody = parse(body);

        // Verific datele din request body
        if(parsedBody.userId == null || parsedBody.userId.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            var json = JSON.stringify({
                status: "failed",
                message: "Not enough data in request body."
            });
            response.end(json);
            return;
        }

        // Preiau din baza de date modelele GamificationUserData, dupa id-ul utilizatorului
        var listOfGamificationUserDataModels = 0;
        await gamificationSystemExternalServices.getGamificationUserDataByUserId(
            queryStringObject.apikey, parsedBody.userId
        ).then(function (result) {
            listOfGamificationUserDataModels = result;
        });

        while(listOfGamificationUserDataModels == 0) {
            await utils.timeout(10);
        }

        if(listOfGamificationUserDataModels == -1) {
            response.statusCode = 500; // 500 - Internal Server Error
            var json = JSON.stringify({
                status: "failed"
            });
            response.end(json);
            return;
        }

        if(listOfGamificationUserDataModels == null) {
            var json = JSON.stringify({
                status: "success",
                rewards: []
            })
            response.end(json);
            return;
        }

        // Preiau din baza de date modelele GamificationReward, dupa id-urile din modelele GamificationUserData
        var listOfRewardModels = null;
        await gamificationSystemServices.getGamificationRewardModelsByAPIKey(queryStringObject.apikey).then(function (result) {
            listOfRewardModels = result;
        });

        while(listOfRewardModels == null) {
            await utils.timeout(10);
        }

        if(listOfRewardModels == -1) {
            response.statusCode = 500; // 500 - Internal Server Error
            var json = JSON.stringify({
                status: "failed"
            });
            response.end(json);
            return;
        }

        // Construiesc raspunsul
        var rewardData = [];
        for(var i=0; i<listOfGamificationUserDataModels.length; i++) {
            var rewardModel = (listOfRewardModels.filter(model => model.id == listOfGamificationUserDataModels[i].rewardId).length > 0) ?
                    (listOfRewardModels.filter(model => model.id == listOfGamificationUserDataModels[i].rewardId)[0]) :
                    null;
            
            if(rewardModel != null) {
                var rewardDataObject = Object();
                rewardDataObject.reward_name = rewardModel.name;
                rewardDataObject.reward_type = rewardModel.type;
                rewardDataObject.reward_value = rewardModel.rewardValue;
                rewardDataObject.progress = (Math.min((100 * listOfGamificationUserDataModels[i].progress / rewardModel.eventValue), 100)) + "%";

                rewardData.push(rewardDataObject);
            }
        }

        var json = JSON.stringify({
            status: "success",
            rewards: rewardData
        });
        response.end(json);
        return;
    });
}

/**
 * Rezolva un request de tip GET facut la pagina '/external/gamification_system/top_users' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemTopUsersGETRequest(request, response) {
    // Verific validitatea url-ului
    if(!request.url.startsWith('/external/gamification_system/top_users?')) {
        response.statusCode = 404; // 404 - Not Found
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid URL."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split('/external/gamification_system/top_users?')[1];
    var queryStringObject = parse(queryString);
    if(queryStringObject.apikey == null || queryStringObject.apikey.length === 0) {
        response.statusCode = 400; // 400 - Bad Request
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid Query String."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        parsedBody = parse(body);

        // Preiau din baza de date modelele GamificationUserData, dupa cheia API
        var listOfGamificationUserDataModels = 0;
        await gamificationSystemExternalServices.getGamificationUserDatasByAPIKey(
            queryStringObject.apikey
        ).then(function (result) {
            listOfGamificationUserDataModels = result;
        });

        while(listOfGamificationUserDataModels === 0) {
            await utils.timeout(10);
        }

        if(listOfGamificationUserDataModels === -1) {
            response.statusCode = 500; // 500 - Internal Server Error
            var json = JSON.stringify({
                status: "failed"
            });
            response.end(json);
            return;
        }

        if(listOfGamificationUserDataModels == null) {
            var json = JSON.stringify({
                status: "success",
                top: []
            })
            response.end(json);
            return;
        }

        // Preiau din baza de date modelele GamificationReward, dupa id-urile din modelele GamificationUserData
        var listOfRewardModels = null;
        await gamificationSystemServices.getGamificationRewardModelsByAPIKey(queryStringObject.apikey).then(function (result) {
            listOfRewardModels = result;
        });

        while(listOfRewardModels == null) {
            await utils.timeout(10);
        }

        if(listOfRewardModels == -1) {
            response.statusCode = 500; // 500 - Internal Server Error
            var json = JSON.stringify({
                status: "failed"
            });
            response.end(json);
            return;
        }

        // Construiesc raspunsul
        const userIdList = Array.from(new Set(listOfGamificationUserDataModels.map(model => model.userId)));
        let topUsers = []
        for(let i=0; i<userIdList.length; i++) {
            let userScore = 0;
            let userDataList = listOfGamificationUserDataModels.filter(model => model.userId === userIdList[i]);

            for(let j=0; j<userDataList.length; j++) {
                let rewardModel = listOfRewardModels.filter(model => model.id === userDataList[j].rewardId)[0];
                if(rewardModel != null) {
                    userScore += rewardModel.rewardValue * userDataList[j].progress;
                }
            }

            topUsers.push(new Object({
                userId: userIdList[i],
                score: userScore
            }));
        }
        topUsers.sort(function compare(obj1, obj2) {
            if(obj2.score > obj1.score)
                return 1;

            if(obj1.score > obj2.score)
                return -1;

            return 0;
        })
        var json = JSON.stringify({
            status: "success",
            top: topUsers
        });
        response.end(json);
        return;
    });
}

/**
 * Rezolva un request de tip DELETE facut la pagina '/external/gamification_system' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemDELETERequest(request, response) {
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

    // Citesc si parsez request body-ul
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    var parsedBody;
    request.on('end', async () => {
        parsedBody = parse(body);

        // Verific datele din request body
        if(parsedBody.userId == null || parsedBody.userId.length == 0 ||
                parsedBody.rewardName == null | parsedBody.rewardName.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            var json = JSON.stringify({
                status: "failed",
                message: "Not enough data in request body."
            });
            response.end(json);
            return;
        }

        // Sterg datele legate de utiliatorul cu id-ul dat
        var serviceResult = null;
        await gamificationSystemExternalServices.deleteGamificationUserData(
            queryStringObject.apikey, parsedBody.userId, parsedBody.rewardName
        ).then(function (result) {
            serviceResult = result;
        })

        while(serviceResult == null) {
            await utils.timeout(10);
        }

        if(serviceResult == 1) {
            response.statusCode = 422; // 422 - Unprocessable Entity
            var json = JSON.stringify({
                status: "failed",
                message: "Invalid API key/reward name."
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

        var json = JSON.stringify({
            status: "success"
        });
        response.end(json);
        return;
    });
}
module.exports = {handleExternalGamificationSystemPOSTPUTRequest, handleExternalGamificationSystemGETRequest,
    handleExternalGamificationSystemDELETERequest, handleExternalGamificationSystemTopUsersGETRequest};