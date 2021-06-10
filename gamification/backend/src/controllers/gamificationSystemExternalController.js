const { parse } = require('querystring');

const utils = require('../internal/utils');

const GamificationSystemExternalServices = require('../services/GamificationSystemExternalServices');
const GamificationSystemServices = require('../services/GamificationSystemServices');

/**
 * Rezolva un request de tip POST/PUT facut la pagina '/external/gamification-system' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemPOSTPUTRequest(request, response) {
    response.setHeader("Content-Type", "application/json");

    // Verific validitatea url-ului
    if(!request.url.startsWith('/external/gamification-system?')) {
        response.statusCode = 404; // 404 - Not Found
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid URL."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split('/external/gamification-system?')[1];
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
        if(parsedBody.userId == null || parsedBody.userId.length === 0 ||
                parsedBody.eventName == null || parsedBody.eventName.length === 0) {
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
        await GamificationSystemExternalServices.addGamificationUserDataToDatabase(
            queryStringObject.apikey, parsedBody.userId, parsedBody.eventName
        ).then(function (result) {
            serviceResult = result;
        });

        while(serviceResult == null) {
            await utils.timeout(10);
        }

        if(serviceResult === 1) {
            response.statusCode = 422; // 422 - Unprocessable Entity
            var json = JSON.stringify({
                status: "failed",
                message: "Invalid API key/event name."
            });
            response.end(json);
            return;
        }

        if(serviceResult === -1) {
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
 * Rezolva un request de tip GET facut la pagina '/external/gamification-system' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemGETRequest(request, response) {
    response.setHeader("Content-Type", "application/json");

    // Verific validitatea url-ului
    if(!request.url.startsWith('/external/gamification-system?')) {
        response.statusCode = 404; // 404 - Not Found
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid URL."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split('/external/gamification-system?')[1];
    var queryStringObject = parse(queryString);
    if(queryStringObject.apikey == null || queryStringObject.apikey.length === 0 ||
            queryStringObject.userId == null || queryStringObject.userId.length === 0) {
        response.statusCode = 400; // 400 - Bad Request
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid Query String."
        });
        response.end(json);
        return;
    }

    // Preiau din baza de date modelele GamificationUserData, dupa id-ul utilizatorului
    var listOfGamificationUserDataModels = 0;
    await GamificationSystemExternalServices.getGamificationUserDataByUserId(
        queryStringObject.apikey, queryStringObject.userId
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
            rewards: []
        })
        response.end(json);
        return;
    }

    // Preiau din baza de date modelele GamificationReward, dupa id-urile din modelele GamificationUserData
    var listOfRewardModels = null;
    await GamificationSystemServices.getGamificationRewardModelsByAPIKey(queryStringObject.apikey).then(function (result) {
        listOfRewardModels = result;
    });

    while(listOfRewardModels == null) {
        await utils.timeout(10);
    }

    if(listOfRewardModels === -1) {
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
            // Preiau din baza de date modelul GamificationEvent
            var eventModel = 0;
            await GamificationSystemServices.getGamificationEventModelById(rewardModel.eventId).then(function (result) {
                eventModel = result;
            })

            while(eventModel === 0) {
                await utils.timeout(10);
            }

            if(eventModel === -1) {
                response.statusCode = 500; // 500 - Internal Server Error
                var json = JSON.stringify({
                    status: "failed"
                });
                response.end(json);
                return;
            }

            if(eventModel != null) {
                var rewardDataObject = Object();
                rewardDataObject.reward_name = rewardModel.name;
                rewardDataObject.reward_type = rewardModel.type;
                rewardDataObject.reward_value = rewardModel.rewardValue;
                if(eventModel.eventType === 'time') {
                    let progress = (new Date(Date.now()).getTime() - new Date(listOfGamificationUserDataModels[i].firstIssuedAt).getTime()) / (1000 * 3600);
                    rewardDataObject.progress = (Math.min((100 * progress / rewardModel.eventValue).toFixed(2), 100)) + "%";
                }
                else {
                    rewardDataObject.progress = (Math.min((100 * listOfGamificationUserDataModels[i].progress / rewardModel.eventValue), 100)) + "%";
                }

                rewardData.push(rewardDataObject);
            }
        }
    }

    var json = JSON.stringify({
        status: "success",
        rewards: rewardData
    });
    response.end(json);
    return;
}

/**
 * Rezolva un request de tip GET facut la pagina '/external/gamification-system/top-users' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemTopUsersGETRequest(request, response) {
    response.setHeader("Content-Type", "application/json");

    // Verific validitatea url-ului
    if(!request.url.startsWith('/external/gamification-system/top-users?')) {
        response.statusCode = 404; // 404 - Not Found
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid URL."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split('/external/gamification-system/top-users?')[1];
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
        await GamificationSystemExternalServices.getGamificationUserDatasByAPIKey(
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
        await GamificationSystemServices.getGamificationRewardModelsByAPIKey(queryStringObject.apikey).then(function (result) {
            listOfRewardModels = result;
        });

        while(listOfRewardModels == null) {
            await utils.timeout(10);
        }

        if(listOfRewardModels === -1) {
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
            let userDataList = listOfGamificationUserDataModels.filter(model => model.userId == userIdList[i]);

            for(let j=0; j<userDataList.length; j++) {
                let rewardModel = listOfRewardModels.filter(model => model.id == userDataList[j].rewardId)[0];

                if(rewardModel != null) {
                    // Preiau din baza de date modelul GamificationEvent
                    var eventModel = 0;
                    await GamificationSystemServices.getGamificationEventModelById(rewardModel.eventId).then(function (result) {
                        eventModel = result;
                    })

                    while(eventModel === 0) {
                        await utils.timeout(10);
                    }

                    if(eventModel === -1) {
                        response.statusCode = 500; // 500 - Internal Server Error
                        var json = JSON.stringify({
                            status: "failed"
                        });
                        response.end(json);
                        return;
                    }

                    if(eventModel != null) {
                        if (eventModel.eventType === 'time') {
                            let progress = (new Date(Date.now()).getTime() - new Date(userDataList[j].firstIssuedAt).getTime()) / (1000 * 3600);
                            userScore += rewardModel.rewardValue * Math.min(progress, rewardModel.eventValue);
                        } else {
                            userScore += rewardModel.rewardValue * userDataList[j].progress / rewardModel.eventValue;
                        }
                    }
                }
            }

            topUsers.push(new Object({
                userId: userIdList[i],
                score: userScore.toFixed(2)
            }));
        }
        topUsers.sort(function compare(obj1, obj2) {
            if(Number(obj2.score) > Number(obj1.score))
                return 1;

            if(Number(obj1.score) > Number(obj2.score))
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
 * Rezolva un request de tip DELETE facut la pagina '/external/gamification-system' de catre un site extern.
 * @param {*} request Cererea facuta de catre client.
 * @param {*} response Raspunsul dat.
 */
async function handleExternalGamificationSystemDELETERequest(request, response) {
    response.setHeader("Content-Type", "application/json");

    // Verific validitatea url-ului
    if(!request.url.startsWith('/external/gamification-system?')) {
        response.statusCode = 404; // 404 - Not Found
        var json = JSON.stringify({
            status: "failed",
            message: "Invalid URL."
        });
        response.end(json);
        return;
    }

    // Citesc si parsez Query String-ul
    var queryString = request.url.split('/external/gamification-system?')[1];
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

        // Verific datele din request body
        if(parsedBody.userId == null || parsedBody.userId.length === 0 ||
                parsedBody.rewardName == null | parsedBody.rewardName.length === 0) {
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
        await GamificationSystemExternalServices.deleteGamificationUserData(
            queryStringObject.apikey, parsedBody.userId, parsedBody.rewardName
        ).then(function (result) {
            serviceResult = result;
        })

        while(serviceResult == null) {
            await utils.timeout(10);
        }

        if(serviceResult === 1) {
            response.statusCode = 422; // 422 - Unprocessable Entity
            var json = JSON.stringify({
                status: "failed",
                message: "Invalid API key/reward name."
            });
            response.end(json);
            return;
        }

        if(serviceResult === -1) {
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