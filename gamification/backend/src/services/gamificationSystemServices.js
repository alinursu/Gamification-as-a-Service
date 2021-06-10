const GamificationEventModel = require('../models/GamificationEvent');
const GamificationRewardModel = require('../models/GamificationReward');
const GamificationSystemModel = require('../models/GamificationSystem');

const GamificationSystemsRepository = require('../repositories/GamificationSystemsRepository');
const TokensRepository = require('../repositories/TokensRepository');

const utils = require('../internal/utils');
const {getDatabaseConnection} = require('../internal/databaseConnection');

/**
 * Genereaza o cheie API.
 * @returns Cheia API generata.
 */
async function generateAPIKey() {
    var keyLength = 64;
    var key = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@%^*_-';
    var charactersLength = characters.length;
    for (var i = 0; i < keyLength; i++) {
        key.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return key.join('');
}

/**
 * Creeaza un model GamificationSystem pe baza informatiilor din requestBody. Functia, de asemenea, verifica prezenta si valideaza datele oferite de utilizator.
 * @param {*} requestBody Request Body-ul cererii de tip POST initiata de utilizator.
 * @param {*} token Token-ul de autentificare al acestuia (preluat din cookie).
 * @param {*} routeFunctionCallback Functia de rutare care va fi apelata.
 * @param {*} request Cererea facuta de utilizator.
 * @param {*} response Raspunsul dat de server pentru cererea facuta de acesta.
 * @param {*} apikey Cheia API deja atribuita modelului (daca exista; by default null).
 * @returns Modelul creat, pe baza informatiilor oferite; NULL, daca lipsesc informatii sau unele nu sunt valide, iar un raspuns pentru request este generat.
 */
async function createModelFromRequestBodyData(requestBody, token, routeFunctionCallback, request, response, apikey = null) {
    var listOfEventModels = [];
    var validModel = true;
    var errorMessage = null;

    // Creez modelele evenimentelor
    if (requestBody.system_name.length === 0 && validModel) {
        validModel = false;

        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        errorMessage = "Sistemul de recompense trebuie sa aibă un nume!"
    }

    // Preiau indecsii evenimentelor
    var eventKeys = Object.keys(requestBody).filter(key => key.startsWith('nume_eveniment'));
    var eventIndexes = [];
    for (var i = 0; i < eventKeys.length; i++) {
        eventIndexes.push(eventKeys[i].split('nume_eveniment')[1]);
    }

    // Creez modelele evenimentelor
    for (var i = 0; i < eventIndexes.length; i++) {
        var index = eventIndexes[i];
        var eventModel = new GamificationEventModel(requestBody['id_eveniment' + index], apikey, requestBody['nume_eveniment' + index], requestBody['tip_eveniment' + index]);

        if (eventModel.name.length === 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare eveniment trebuie să aibă atribuit un nume unic!"
        }

        if (eventModel.eventType == null && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare eveniment trebuie să aibă selectat un tip!"
        }

        listOfEventModels.push(eventModel);
        index++;
    }

    if (listOfEventModels.length === 0 && validModel) {
        validModel = false;

        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        errorMessage = "Un sistem de recompense trebuie să conțină cel puțin un eveniment!"
    }

    // Verific unicitatea datelor din modelele evenimentelor
    for (index = 0; index < listOfEventModels.length; index++) {
        var tempArray = listOfEventModels.filter(eventModel => eventModel.name == listOfEventModels[index].name);

        if (tempArray.length > 1 && validModel) {
            validModel = false;

            response.statusCode = 409; // 409 - Conflict
            errorMessage = "Numele evenimentelor trebuie să fie unice!"
        }
    }

    // Preiau indecsii recompenselor
    var rewardKeys = Object.keys(requestBody).filter(key => key.startsWith('nume_recompensa'));
    var rewardIndexes = [];
    for (var i = 0; i < rewardKeys.length; i++) {
        rewardIndexes.push(rewardKeys[i].split('nume_recompensa')[1]);
    }

    // Creez modelele recompenselor
    var listOfRewardModels = [];
    for (var i = 0; i < rewardIndexes.length; i++) {
        var index = rewardIndexes[i];
        var rewardModel = new GamificationRewardModel(requestBody['id_recompensa' + index], apikey, requestBody['nume_recompensa' + index], requestBody['tip_recompensa' + index],
            requestBody['eveniment_recompensa' + index], requestBody['valoare_eveniment' + index], requestBody['punctaj' + index]);

        if (rewardModel.name.length === 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare recompensă trebuie să aibă atribuit un nume unic!";
        }

        if (rewardModel.type == null && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare recompensă trebuie să aibă selectat un tip!"
        }

        if (rewardModel.eventId.length === 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare recompensă trebuie să aibă atribuit un eveniment care o controlează!"
        }

        var tempArray = listOfEventModels.filter(eventModel => eventModel.name == rewardModel.eventId);
        if (tempArray.length === 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Nu poți atribui unei recompense un eveniment inexistent!"
        }

        if (rewardModel.eventValue.length === 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare recompensă trebuie să aibă atribuită o valoare pentru care se va oferi recompensa!"
        }

        if (parseFloat(rewardModel.eventValue, 10) == NaN && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Valoarea pentru care se va oferi recompensa trebuie să fie un număr real pozitiv!"
        }

        rewardModel.eventValue = parseFloat(rewardModel.eventValue, 10);

        if (rewardModel.eventValue <= 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Valoarea pentru care se va oferi recompensa trebuie să fie un număr real pozitiv!"
        }

        if (rewardModel.rewardValue.length === 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Fiecare recompensă trebuie să aibă atribuită o valoare a importanței!"
        }

        if (parseInt(rewardModel.rewardValue, 10) == NaN && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Valoarea importanței unei recompense trebuie să fie un număr întreg pozitiv!"
        }

        rewardModel.rewardValue = parseInt(rewardModel.rewardValue, 10);

        if (rewardModel.rewardValue <= 0 && validModel) {
            validModel = false;

            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            errorMessage = "Valoarea importanței unei recompense trebuie să fie un număr întreg pozitiv!"
        }

        listOfRewardModels.push(rewardModel);
        index++;
    }

    if (listOfRewardModels.length === 0 && validModel) {
        validModel = false;

        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        errorMessage = "Un sistem de recompense trebuie să conțină cel puțin o recompensă!"
    }

    // Verific unicitatea datelor din modelele recompenselor
    for (index = 0; index < listOfRewardModels.length; index++) {
        var tempArray = listOfRewardModels.filter(rewardModel => rewardModel.name === listOfRewardModels[index].name);

        if (tempArray.length > 1 && validModel) {
            validModel = false;

            response.statusCode = 409; // 409 - Conflict
            errorMessage = "Numele recompenselor trebuie să fie unice!"
        }
    }

    // Creez modelul sistemului de gamificare
    var userId = null;
    await TokensRepository.getUserIdByToken(token).then(function (result) {
        userId = result;
    });

    while (userId == null) {
        await utils.timeout(10);
    }

    var gamificationSystemModel = new GamificationSystemModel(apikey, requestBody.system_name,
        userId, listOfEventModels, listOfRewardModels);

    if (validModel) {
        return gamificationSystemModel;
    }

    // Construiesc request-ul primit pentru a recompleta formularul paginii
    request.errorMessage = errorMessage;

    for (var index = 0; index < gamificationSystemModel.listOfGamificationEvents.length; index++) {
        gamificationSystemModel.listOfGamificationEvents[index].id = index + 1;
    }

    for (var index = 0; index < gamificationSystemModel.listOfGamificationRewards.length; index++) {
        gamificationSystemModel.listOfGamificationRewards[index].id = index + 1;
    }
    ;

    request.gamificationSystemModel = gamificationSystemModel;
    routeFunctionCallback(request, response);
    return null;
}

/**
 * Adauga un model GamificationSystem in baza de date, generandu-i si o cheie API.
 * @param {*} gamificationSystemModel Modelul care va fi adaugat in baza de date.
 * @param {*} apiKey Cheia API care va fi folosita pentru model (poate fi NULL si se va genera una noua).
 * @returns Cheia API, daca modelul a fost adaugat in baza de date; 1, daca exista deja un sistem asociat utilizatorului acesta, avand acelasi nume; -1 daca a aparut o eroare pe parcursul exeuctiei
 */
async function addGamificationSystemModelToDatabase(gamificationSystemModel, apikey = null) {
    if (apikey == null) {
        await generateAPIKey().then(function (apikey) {
            gamificationSystemModel.APIKey = apikey;
        });

        while (gamificationSystemModel.APIKey == null) {
            await utils.timeout(10);
        }
    } else {
        gamificationSystemModel.APIKey = apikey;
    }

    // Verific daca exista un sistem de recomandari creat de acelasi utilizator, care sa aiba acelasi nume
    var dbResult = null;
    await GamificationSystemsRepository.getGamificationSystemsByUserId(gamificationSystemModel.userId).then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
        await utils.timeout(10);
    }

    if (dbResult === -1) {
        return -1;
    }

    var tempArray = dbResult.filter(tempGamificationSystemModel => tempGamificationSystemModel.name == gamificationSystemModel.name);
    if (tempArray.length > 0) {
        return 1;
    }

    // Adaug sistemul in baza de date
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;
    connectionPool.getConnection(async function (error, connection) {
        var dbResult = null;
        connection.beginTransaction();

        while (dbResult == null) {
            await GamificationSystemsRepository.addGamificationSystemToDatabase(gamificationSystemModel, connection).then(function (result) {
                dbResult = result;
            })

            while (dbResult == null) {
                await utils.timeout(10);
            }

            switch (dbResult) {
                case -1: {
                    connection.rollback();
                    connection.release();
                    returnedValue = -1;
                    return -1;
                }

                case 1: { // Primary key constraint violation handling
                    gamificationSystemModel.APIKey = null;
                    dbResult = null;

                    await generateAPIKey().then(function (apikey) {
                        gamificationSystemModel.APIKey = apikey;
                    });

                    while (gamificationSystemModel.APIKey == null) {
                        await utils.timeout(10);
                    }

                    break;
                }

                case 0: {
                    break;
                }
            }
        }

        // Adaug evenimentele in baza de date
        var dbResult = null;
        for (var index = 0; index < gamificationSystemModel.listOfGamificationEvents.length; index++) {
            gamificationSystemModel.listOfGamificationEvents[index].systemAPIKey = gamificationSystemModel.APIKey;

            await GamificationSystemsRepository.addGamificationEventToDatabase(
                gamificationSystemModel.listOfGamificationEvents[index], connection
            ).then(function (result) {
                dbResult = result;
            });

            while (dbResult == null) {
                await utils.timeout(10);
            }

            if (dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return -1;
            }
        }

        // Adaug recompensele in baza de date
        var dbResult = null;
        for (var index = 0; index < gamificationSystemModel.listOfGamificationRewards.length; index++) {
            // Completez modelul cu id-ul evenimentului si api key-ul generat
            var eventModel = null;
            await GamificationSystemsRepository.getGamificationEventByAPIKeyAndName(
                gamificationSystemModel.APIKey, gamificationSystemModel.listOfGamificationRewards[index].eventId, connection
            ).then(function (result) {
                eventModel = result;
            });

            while (eventModel == null) {
                await utils.timeout(10);
            }

            gamificationSystemModel.listOfGamificationRewards[index].systemAPIKey = gamificationSystemModel.APIKey;
            gamificationSystemModel.listOfGamificationRewards[index].eventId = eventModel.id;

            // Adaug in baza de date
            await GamificationSystemsRepository.addGamificationRewardToDatabase(
                gamificationSystemModel.listOfGamificationRewards[index], connection
            ).then(function (result) {
                dbResult = result;
            });

            while (dbResult == null) {
                await utils.timeout(10);
            }

            if (dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return -1;
            }
        }

        connection.commit();
        connection.release();

        returnedValue = 0;
        return 0;
    });

    while (returnedValue == null) {
        await utils.timeout(10);
    }

    if (returnedValue === 0) {
        return gamificationSystemModel.APIKey;
    }
    return returnedValue;
}

/**
 * Adauga un model GamificationSystem in baza de date, fara evenimente si recompense, generandu-i si o cheie API.
 * @param {*} gamificationSystemModel Modelul care va fi adaugat in baza de date.
 * @param {*} apiKey Cheia API care va fi folosita pentru model (poate fi NULL si se va genera una noua).
 * @returns Cheia API, daca modelul a fost adaugat in baza de date; 1, daca exista deja un sistem asociat utilizatorului acesta, avand acelasi nume; -1 daca a aparut o eroare pe parcursul exeuctiei
 */
async function addEmptyGamificationSystemModelToDatabase(gamificationSystemModel, apikey = null) {
    if (apikey == null) {
        await generateAPIKey().then(function (apikey) {
            gamificationSystemModel.APIKey = apikey;
        });

        while (gamificationSystemModel.APIKey == null) {
            await utils.timeout(10);
        }
    } else {
        gamificationSystemModel.APIKey = apikey;
    }

    // Verific daca exista un sistem de recomandari creat de acelasi utilizator, care sa aiba acelasi nume
    var dbResult = null;
    await GamificationSystemsRepository.getGamificationSystemsByUserId(gamificationSystemModel.userId).then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
        await utils.timeout(10);
    }

    if (dbResult === -1) {
        return -1;
    }

    var tempArray = dbResult.filter(tempGamificationSystemModel => tempGamificationSystemModel.name == gamificationSystemModel.name);
    if (tempArray.length > 0) {
        return 1;
    }

    // Adaug sistemul in baza de date
    var dbResult = null;
    while (dbResult == null) {
        await GamificationSystemsRepository.addGamificationSystemToDatabase(gamificationSystemModel).then(function (result) {
            dbResult = result;
        })

        while (dbResult == null) {
            await utils.timeout(10);
        }

        switch (dbResult) {
            case -1: {
                return -1;
            }

            case 1: { // Primary key constraint violation handling
                gamificationSystemModel.APIKey = null;
                dbResult = null;

                await generateAPIKey().then(function (apikey) {
                    gamificationSystemModel.APIKey = apikey;
                });

                while (gamificationSystemModel.APIKey == null) {
                    await utils.timeout(10);
                }

                dbResult = null;
                break;
            }

            case 0: {
                break;
            }
        }
    }

    return gamificationSystemModel.APIKey;
}

/**
 * Construieste o lista de modele GamificationSystem (incluzand modelele de GamificationReward si GamificationEvent din ele) create de un anumit utilizator, folosind datele din baza de date.
 * @param {*} userId Id-ul utilizatorului pentru care se face cautarea.
 * @returns Lista de modele GamificationSystem create de utilizator; -1 daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationSystemModelsByUserId(userId) {
    var outputList = [];

    // Preiau modelele GamificationSystem
    var listOfGamificationSystemModels = null;
    await GamificationSystemsRepository.getGamificationSystemsByUserId(userId).then(function (result) {
        listOfGamificationSystemModels = result;
    });

    while (listOfGamificationSystemModels == null) {
        await utils.timeout(10);
    }

    if (listOfGamificationSystemModels === -1) {
        return -1;
    }

    for (var index = 0; index < listOfGamificationSystemModels.length; index++) {
        // Creez modelul
        var gamificationSystemModel = new GamificationSystemModel(
            listOfGamificationSystemModels[index].api_key, listOfGamificationSystemModels[index].name, listOfGamificationSystemModels[index].user_id, null, null
        );
        var listOfGamificationRewardModels = [];
        var listOfGamificationEventModels = [];

        // Pentru fiecare model GamificationSystem, preiau modelele GamificationEvent
        var queryResult = null;
        await GamificationSystemsRepository.getGamificationEventModelsByAPIKey(gamificationSystemModel.APIKey).then(function (result) {
            queryResult = result;
        });

        while (queryResult == null) {
            await utils.timeout(10);
        }

        if (queryResult === -1) return -1;

        queryResult.forEach(queryResultObj => {
            listOfGamificationEventModels.push(new GamificationEventModel(
                queryResultObj.id, queryResultObj.system_api_key, queryResultObj.name, queryResultObj.event_type
            ));
        });


        // Pentru fiecare model GamificationSystem, preiau modelele GamificationReward
        var queryResult2 = null;
        await GamificationSystemsRepository.getGamificationRewardModelsByAPIKey(gamificationSystemModel.APIKey).then(function (result) {
            queryResult2 = result;
        });

        while (queryResult2 == null) {
            await utils.timeout(10);
        }

        if (queryResult2 === -1) return -1;

        queryResult2.forEach(queryResultObj => {
            listOfGamificationRewardModels.push(new GamificationRewardModel(
                queryResultObj.id, queryResultObj.system_api_key, queryResultObj.name, queryResultObj.type, queryResultObj.occurs_at_event_id,
                queryResultObj.event_value, queryResultObj.reward_value
            ));
        });

        gamificationSystemModel.listOfGamificationEvents = listOfGamificationEventModels;
        gamificationSystemModel.listOfGamificationRewards = listOfGamificationRewardModels;
        outputList.push(gamificationSystemModel);
    }

    return outputList;
}

/**
 * Construieste un model GamificationSystem (incluzand modelele de GamificationReward si GamificationEvent din ele) dupa o cheie API.
 * @param {*} APIKey Cheia API dupa se face cautarea.
 * @returns Modelul GamificationSystem gasit; null, daca nu exista niciunul cu aceasta cheie API; -1 daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationSystemModelByAPIKey(APIKey) {
    // Preiau modelul GamificationSystem
    var gamificationSystemModel = 0;
    await GamificationSystemsRepository.getGamificationSystemByApiKey(APIKey).then(function (result) {
        gamificationSystemModel = result;
    });

    while (gamificationSystemModel === 0) {
        await utils.timeout(10);
    }

    if (gamificationSystemModel == null || gamificationSystemModel === -1) {
        return gamificationSystemModel;
    }

    // Preiau modelele GamificationEvent
    var listOfGamificationEventModels = null;

    await GamificationSystemsRepository.getGamificationEventModelsByAPIKey(APIKey).then(function (result) {
        listOfGamificationEventModels = result;
    });

    while (listOfGamificationEventModels == null) {
        await utils.timeout(10);
    }

    if (listOfGamificationEventModels === -1) return -1;

    // Formatez modelele GamificationEvent
    var tempList = [];
    for (var i = 0; i < listOfGamificationEventModels.length; i++) {
        var eventModel = new GamificationEventModel(
            listOfGamificationEventModels[i].id, listOfGamificationEventModels[i].system_api_key,
            listOfGamificationEventModels[i].name, listOfGamificationEventModels[i].event_type
        );

        tempList.push(eventModel);
    }
    listOfGamificationEventModels = tempList;

    // Preiau modelele GamificationReward
    var listOfGamificationRewardModels = null;

    await GamificationSystemsRepository.getGamificationRewardModelsByAPIKey(APIKey).then(function (result) {
        listOfGamificationRewardModels = result;
    });

    while (listOfGamificationRewardModels == null) {
        await utils.timeout(10);
    }

    if (listOfGamificationRewardModels === -1) return -1;

    // Formatez modelele GamificationReward
    var tempList = [];
    for (var i = 0; i < listOfGamificationRewardModels.length; i++) {
        var rewardModel = new GamificationRewardModel(
            listOfGamificationRewardModels[i].id, listOfGamificationRewardModels[i].system_api_key,
            listOfGamificationRewardModels[i].name, listOfGamificationRewardModels[i].type,
            listOfGamificationRewardModels[i].occurs_at_event_id, listOfGamificationRewardModels[i].event_value,
            listOfGamificationRewardModels[i].reward_value
        );

        tempList.push(rewardModel);
    }
    listOfGamificationRewardModels = tempList;

    gamificationSystemModel.listOfGamificationEvents = listOfGamificationEventModels;
    gamificationSystemModel.listOfGamificationRewards = listOfGamificationRewardModels;
    return gamificationSystemModel;
}

/**
 * Sterge din baza de date un model GamificationSystem, pe baza unei chei API.
 * @param {*} APIKey Cheia API dupa care se face stergerea.
 * @return 0, daca stergerea a fost efectuata cu succes; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteGamificationSystemModelByAPIKey(APIKey) {
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;

    connectionPool.getConnection(async function (error, connection) {
        var dbResult = null;
        connection.beginTransaction();

        // Sterg modelele GamificationReward din baza de date
        await GamificationSystemsRepository.deleteAllGamificationRewardsByAPIKey(APIKey, connection).then(function (result) {
            dbResult = result;
        });

        while (dbResult == null) {
            await utils.timeout(10);
        }

        if (dbResult === -1) {
            connection.rollback();
            connection.release();
            returnedValue = -1;
            return -1;
        }

        // Sterg modelele GamificationEvent din baza de date
        dbResult = null;
        await GamificationSystemsRepository.deleteAllGamificationEventsByAPIKey(APIKey, connection).then(function (result) {
            dbResult = result;
        });

        while (dbResult == null) {
            await utils.timeout(10);
        }

        if (dbResult === -1) {
            connection.rollback();
            connection.release();
            returnedValue = -1;
            return -1;
        }

        // Sterg modelul GamificationSystem din baza de date
        dbResult = null;
        await GamificationSystemsRepository.deleteGamificationSystemByAPIKey(APIKey, connection).then(function (result) {
            dbResult = result;
        });

        while (dbResult == null) {
            await utils.timeout(10);
        }

        if (dbResult === -1) {
            connection.rollback();
            connection.release();
            returnedValue = -1;
            return -1;
        }

        connection.commit();
        connection.release();

        returnedValue = 0;
        return 0;
    });

    while (returnedValue == null) {
        await utils.timeout(10);
    }

    return returnedValue;
}

/**
 * Cauta in baza de date modelele GamificationReward create pentru un anumit sistem.
 * @param {*} APIKey Cheia API a sistemului de gamificare.
 * @return Lista modelelor GamificationReward; -1, daca a aparut o eroare pe parcursul executiei
 */
async function getGamificationRewardModelsByAPIKey(APIKey) {
    var dbResult = null;
    await GamificationSystemsRepository.getGamificationRewardModelsByAPIKey(APIKey).then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
        await utils.timeout(10);
    }

    if (dbResult === -1) return -1;
    if (dbResult.length === 0) return [];

    // Creez modelele
    var outputList = [];
    for (var i = 0; i < dbResult.length; i++) {
        var rewardModel = new GamificationRewardModel(dbResult[i].id, dbResult[i].system_api_key, dbResult[i].name, dbResult[i].type,
            dbResult[i].occurs_at_event_id, dbResult[i].event_value, dbResult[i].reward_value);
        outputList.push(rewardModel);
    }

    return outputList;
}

/**
 * Preia din baza de date toate modelele GamificationSystem din baza de date.
 * @returns Lista modelelor GamificationSystem; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getAllGamificationSystems() {
    var dbResult = null;
    await GamificationSystemsRepository.getAllSystems().then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Preia din baza de date toate modelele GamificationReward din baza de date.
 * @returns Lista modelelor GamificationReward; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getAllGamificationReward() {
    var dbResult = null;
    await GamificationSystemsRepository.getAllRewards().then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Preia din baza de date toate modelele GamificationEvent din baza de date.
 * @returns Lista modelelor GamificationEvent; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getAllGamificationEvent() {
    var dbResult = null;
    await GamificationSystemsRepository.getAllEvents().then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}


module.exports = {
    createModelFromRequestBodyData,
    addGamificationSystemModelToDatabase,
    getGamificationSystemModelsByUserId,
    getGamificationSystemModelByAPIKey,
    deleteGamificationSystemModelByAPIKey,
    getGamificationRewardModelsByAPIKey,
    getAllGamificationSystems,
    getAllGamificationReward,
    getAllGamificationEvent,
    addEmptyGamificationSystemModelToDatabase
}