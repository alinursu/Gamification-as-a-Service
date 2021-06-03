
const utils = require('../internal/utils');
const gamificationSystemServices = require('../services/gamificationSystemServices');
const gamificationSystemExternalRepository = require('../repositories/gamificationSystemExternalRepository');
const GamificationUserData = require('../models/GamificationUserData');

/**
 * Adauga in baza de date datele primite prin apelarea API-ului extern.
 * @param {*} APIKey Cheia API prin care s-a facut apelarea.
 * @param {*} userId Id-ul utilizatorului, dat de catre cel care a apelat API-ul extern.
 * @param {*} eventName Numele evenimentului, dat de catre cel care a apelat API-ul extern.
 * @returns 0, daca datele au fost adaugate in baza de date; 1, daca nu am gasit niciun model GamificationSystem dupa cheia API/eveniment dupa nume; -1, daca a aparut o eroare pe parcursul executarii.
 */
async function addGamificationUserDataToDatabase(APIKey, userId, eventName) {
    // Preiau modelul GamificationSystem din baza de date, folosindu-ma de cheia API
    var gamificationSystemModel = 0;
    await gamificationSystemServices.getGamificationSystemModelByAPIKey(APIKey).then(function (result) {
        gamificationSystemModel = result;
    })

    while(gamificationSystemModel == 0) {
        await utils.timeout(10);
    }

    if(gamificationSystemModel == null) return 1;
    if(gamificationSystemModel == -1) return -1;

    // Verific daca exista vreun eventModel cu acest eventName
    var tempList = gamificationSystemModel.listOfGamificationEvents.filter(eventModel => eventModel.name == eventName);
    if(tempList.length == 0) return 1;

    var eventModel = tempList[0];

    // Preiau lista recompenselor controlate de catre acest eveniment
    var rewardModelList = gamificationSystemModel.listOfGamificationRewards.filter(rewardModel => rewardModel.eventId == eventModel.id);
    
    // Inserez/Actualizez datele in baza de date
    for(var i=0; i<rewardModelList.length; i++) {
        var gamificationUserDataModel = 0;

        await gamificationSystemExternalRepository.getGamificationUserData(APIKey, userId, rewardModelList[i].id)
                .then(function (result) {
            gamificationUserDataModel = result;
        });

        while(gamificationUserDataModel == 0) {
            await utils.timeout(10);
        }

        if(gamificationUserDataModel == null) { // Inserez
            gamificationUserDataModel = new GamificationUserData(APIKey, userId, rewardModelList[i].id, 1);

            var dbResult = null;
            await gamificationSystemExternalRepository.insertGamificationUserData(gamificationUserDataModel).then(function (result) {
                dbResult = result;
            });

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult == -1) return -1;
        }
        else { // Actualizez
            gamificationUserDataModel.progress++;

            var dbResult = null;
            await gamificationSystemExternalRepository.updateGamificationUserData(gamificationUserDataModel).then(function (result) {
                dbResult = result;
            });

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult == -1) return -1;
        }
    }

    return 0;
}

/**
 * Sterge din baza de date toate datele legate de progresele utilizatorilor intr-un sistem de gamificatie.
 * @param {*} APIKey Cheia API a sistemului de gamificatie.
 * @returns 0, daca datele au fost sterse; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteGamificationUserDataByAPIKey(APIKey) {
    var dbResult = null;
    await gamificationSystemExternalRepository.deleteGamificationUserDataByAPIKey(APIKey).then(function (result) {
        dbResult = result;
    });

    while(dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Citeste din baza de date modelele GamificationUserData asociate unui id de utilizator.
 * @param {*} APIKey Cheia API a sistemului de gamificatie.
 * @param {*} userId Id-ul utilizatorului dupa care se face cautarea.
 * @returns Lista modelelor GamificationUserData asociate; null, daca nu am gasit niciun model asociat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationUserDataByUserId(APIKey, userId) {
    var dbResult = 0;
    await gamificationSystemExternalRepository.getGamificationUserDataByUserId(APIKey, userId).then(function (result) {
        dbResult = result;
    });

    while(dbResult == 0) {
        await utils.timeout(10);
    }

    return dbResult;
}

module.exports = {addGamificationUserDataToDatabase, deleteGamificationUserDataByAPIKey,
    getGamificationUserDataByUserId};