const GamificationEventModel = require('../models/GamificationEvent');
const GamificationRewardModel = require('../models/GamificationReward');
const GamificationSystemModel = require('../models/GamificationSystem');
const gamificationSystemsRepository = require('../repositories/gamificationSystemsRepository');
const TokensRepository = require('../repositories/tokensRepository');
const formRoute = require('../routes/form');
const utils = require('../internal/utils');

/**
 * Genereaza o cheie API.
 * @returns Cheia API generata.
 */
async function generateAPIKey() {
    var keyLength = 64;
    var key = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=';
    var charactersLength = characters.length;
    for(var i=0; i<keyLength; i++) {
        key.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return key.join('');
}

/**
 * Creeaza un model GamificationSystem pe baza informatiilor din requestBody. Functia, de asemenea, verifica prezenta si valideaza datele oferite de utilizator.
 * @param {*} requestBody Request Body-ul cererii de tip POST initiata de utilizator.
 * @param {*} token Token-ul de autentificare al acestuia (preluat din cookie).
 * @param {*} request Cererea facuta de utilizator.
 * @param {*} response Raspunsul dat de server pentru cererea facuta de acesta.
 * @returns Modelul creat, pe baza informatiilor oferite; NULL, daca lipsesc informatii sau unele nu sunt valide, iar un raspuns pentru request este generat.
 */
async function createModelFromRequestBodyData(requestBody, token, request, response) {
    var listOfEventModels = [];
    var index = 1;

    // TODO: daca nu sunt toate datele prezente/valide => recompleteaza formularul cu datele din modele!
        // cu request.gamificationSystemModel = gamificationSystemModel;

    // Creez modelele evenimentelor
    while(requestBody['nume_eveniment' + index] != null) {
        var eventModel = new GamificationEventModel(null, null, requestBody['nume_eveniment' + index], requestBody['tip_eveniment' + index]);

        if(eventModel.name.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Toate evenimentele trebuie să aibă atribuit un nume unic!"
            formRoute(request, response);
            return null;
        }

        if(eventModel.eventType == null) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Toate evenimentele trebuie să aibă selectat un tip!"
            formRoute(request, response);
            return null;
        }

        listOfEventModels.push(eventModel);
        index++;
    }

    if(listOfEventModels.length == 0) {
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Un sistem de recompense trebuie să conțină cel puțin un eveniment!"
        formRoute(request, response);
        return null;
    }

    // Verific unicitatea datelor din modelele evenimentelor
    for(index=0; index<listOfEventModels.length; index++) {
        var tempArray = listOfEventModels.filter(eventModel => eventModel.name == listOfEventModels[index].name);
        
        if(tempArray.length > 1) {
            response.statusCode = 409; // 409 - Conflict
            request.errorMessage = "Numele evenimentelor trebuie să fie unice!"
            formRoute(request, response);
            return null;
        }
    }

    // Creez modelele recompenselor
    var listOfRewardModels = [];
    index = 1;
    while(requestBody['nume_recompensa' + index] != null) {
        var rewardModel = new GamificationRewardModel(null, null, requestBody['nume_recompensa' + index], requestBody['tip_recompensa' + index], 
                requestBody['eveniment_recompensa' + index], requestBody['valoare_eveniment' + index]);

        if(rewardModel.name.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Toate recompensele trebuie să aibă atribuit un nume unic!"
            formRoute(request, response);
            return null;
        }

        if(rewardModel.type == null) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Toate recompensele trebuie să aibă selectat un tip!"
            formRoute(request, response);
            return null;
        }

        if(rewardModel.eventId.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Toate recompensele trebuie să aibă atribuit un eveniment care o controlează!"
            formRoute(request, response);
            return null;
        }

        var tempArray = listOfEventModels.filter(eventModel => eventModel.name == rewardModel.eventId);
        if(tempArray.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Nu poți atribui unei recompense un eveniment inexistent!"
            formRoute(request, response);
            return null;
        }

        if(rewardModel.value.length == 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Toate recompensele trebuie să aibă atribuită o valoare pentru care se va oferi recompensa!"
            formRoute(request, response);
            return null;
        }

        if(parseInt(rewardModel.value, 10) == NaN) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Valoarea pentru care se va oferi o recompensă trebuie să fie un număr întreg pozitiv!"
            formRoute(request, response);
            return null;
        }

        rewardModel.value = parseInt(rewardModel.value, 10);

        if(rewardModel.value <= 0) {
            response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
            request.errorMessage = "Valoarea pentru care se va oferi o recompensă trebuie să fie un număr întreg pozitiv!"
            formRoute(request, response);
            return null;
        }

        listOfRewardModels.push(rewardModel);
        index++;
    }

    if(listOfRewardModels.length == 0) {
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Un sistem de recompense trebuie să conțină cel puțin o recompensă!"
        formRoute(request, response);
        return null;
    }

    // Verific unicitatea datelor din modelele recompenselor
    for(index=0; index<listOfRewardModels.length; index++) {
        var tempArray = listOfRewardModels.filter(rewardModel => rewardModel.name == listOfRewardModels[index].name);

        if(tempArray.length > 1) {
            response.statusCode = 409; // 409 - Conflict
            request.errorMessage = "Numele recompenselor trebuie să fie unice!"
            formRoute(request, response);
            return null;
        }
    }

    // Creez modelul sistemului de gamificare
    var userId = null;
    await TokensRepository.getUserIdByToken(token).then(function (result) {
        userId = result;
    });

    while(userId == null) {
        await utils.timeout(10);
    }

    var gamificationSystemModel = new GamificationSystemModel(null, requestBody.system_name, 
            userId, listOfEventModels, listOfRewardModels);

    if(gamificationSystemModel.name.length == 0) {
        response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
        request.errorMessage = "Sistemul de recompense trebuie să aibă atribuit un nume!"
        formRoute(request, response);
        return null;
    }

    return gamificationSystemModel;
}

/**
 * Adauga un model GamificationSystem in baza de date, generandu-i si o cheie API.
 * @param {*} gamificationSystemModel Modelul care va fi adaugat in baza de date.
 * @retuns Cheia API, daca modelul a fost adaugat in baza de date; 1, daca exista deja un sistem asociat utilizatorului acesta, avand acelasi nume; -1 daca a aparut o eroare pe parcursul exeuctiei
 */
async function addGamificationSystemModelToDatabase(gamificationSystemModel) {
    await generateAPIKey().then(function (apikey) {
        gamificationSystemModel.APIKey = apikey;
    });

    while(gamificationSystemModel.APIKey == null) {
        await utils.timeout(10);
    }

    // Verific daca exista un sistem de recomandari creat de acelasi utilizator, care sa aiba acelasi nume
    var dbResult = null;
    await gamificationSystemsRepository.getGamificationSystemsByUserId(gamificationSystemModel.userId).then(function (result) {
        dbResult = result;
    });

    while(dbResult == null) {
        await utils.timeout(10);
    }

    if(dbResult == -1) {
        return -1;
    }

    var tempArray = dbResult.filter(tempGamificationSystemModel => tempGamificationSystemModel.name == gamificationSystemModel.name);
    if(tempArray.length > 0) {
        return 1;
    }

    // Adaug sistemul in baza de date
    var dbResult = null;
    while(dbResult == null) {
        await gamificationSystemsRepository.addGamificationSystemToDatabase(gamificationSystemModel).then(function (result) {
            dbResult = result;
        })
    
        while(dbResult == null) {
            await utils.timeout(10);
        }
    
        switch(dbResult) {
            case -1: { 
                return -1;
            }   
    
            case 1: { // Primary key constraint violation handling
                gamificationSystemModel.APIKey = null;
                dbResult = null;
    
                await generateAPIKey().then(function (apikey) {
                    gamificationSystemModel.APIKey = apikey;
                });
            
                while(gamificationSystemModel.APIKey == null) {
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
    for(var index=0; index < gamificationSystemModel.listOfGamificationEvents.length; index++) {
        gamificationSystemModel.listOfGamificationEvents[index].systemAPIKey = gamificationSystemModel.APIKey;
        
        await gamificationSystemsRepository.addGamificationEventToDatabase(
            gamificationSystemModel.listOfGamificationEvents[index]
        ).then(function (result) {
            dbResult = result;
        });
    
        while(dbResult == null) {
            await utils.timeout(10);
        }
    
        if(dbResult == -1) {
            return -1;
        }
    }

    // Adaug recompensele in baza de date
    var dbResult = null;
    for(var index=0; index < gamificationSystemModel.listOfGamificationRewards.length; index++) {
        // Completez modelul cu id-ul evenimentului si api key-ul generat
        var eventModel = null;
        await gamificationSystemsRepository.getGamificationEventByAPIKeyAndName(
            gamificationSystemModel.APIKey, gamificationSystemModel.listOfGamificationRewards[index].eventId
        ).then(function (result) {
            eventModel = result;
        });

        while(eventModel == null) {
            await utils.timeout(10);
        }

        gamificationSystemModel.listOfGamificationRewards[index].systemAPIKey = gamificationSystemModel.APIKey;
        gamificationSystemModel.listOfGamificationRewards[index].eventId = eventModel.id;

        // Adaug in baza de date
        await gamificationSystemsRepository.addGamificationRewardToDatabase(
            gamificationSystemModel.listOfGamificationRewards[index]
        ).then(function (result) {
            dbResult = result;
        });
    
        while(dbResult == null) {
            await utils.timeout(10);
        }
    
        if(dbResult == -1) {
            return -1;
        }
    }

    return gamificationSystemModel.APIKey;
}

module.exports = {createModelFromRequestBodyData, addGamificationSystemModelToDatabase}