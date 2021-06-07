const utils = require('../internal/utils');
const GamificationSystemServices = require('./GamificationSystemServices');
const GamificationSystemExternalRepository = require('../repositories/GamificationSystemExternalRepository');
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
    await GamificationSystemServices.getGamificationSystemModelByAPIKey(APIKey).then(function (result) {
        gamificationSystemModel = result;
    })

    while (gamificationSystemModel === 0) {
        await utils.timeout(10);
    }

    if (gamificationSystemModel == null) return 1;
    if (gamificationSystemModel === -1) return -1;

    // Verific daca exista vreun eventModel cu acest eventName
    var tempList = gamificationSystemModel.listOfGamificationEvents.filter(eventModel => eventModel.name == eventName);
    if (tempList.length === 0) return 1;

    var eventModel = tempList[0];

    // Preiau lista recompenselor controlate de catre acest eveniment
    var rewardModelList = gamificationSystemModel.listOfGamificationRewards.filter(rewardModel => rewardModel.eventId == eventModel.id);

    // Inserez/Actualizez datele in baza de date
    for (var i = 0; i < rewardModelList.length; i++) {
        var gamificationUserDataModel = 0;

        await GamificationSystemExternalRepository.getGamificationUserData(APIKey, userId, rewardModelList[i].id)
            .then(function (result) {
                gamificationUserDataModel = result;
            });

        while (gamificationUserDataModel === 0) {
            await utils.timeout(10);
        }

        if (gamificationUserDataModel == null) { // Inserez
            gamificationUserDataModel = new GamificationUserData(APIKey, userId, rewardModelList[i].id, 1);

            var dbResult = null;
            await GamificationSystemExternalRepository.insertGamificationUserData(gamificationUserDataModel).then(function (result) {
                dbResult = result;
            });

            while (dbResult == null) {
                await utils.timeout(10);
            }

            if (dbResult === -1) return -1;
        } else { // Actualizez
            gamificationUserDataModel.progress++;

            var dbResult = null;
            await GamificationSystemExternalRepository.updateGamificationUserData(gamificationUserDataModel).then(function (result) {
                dbResult = result;
            });

            while (dbResult == null) {
                await utils.timeout(10);
            }

            if (dbResult === -1) return -1;
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
    await GamificationSystemExternalRepository.deleteGamificationUserDataByAPIKey(APIKey).then(function (result) {
        dbResult = result;
    });

    while (dbResult == null) {
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
    await GamificationSystemExternalRepository.getGamificationUserDataByUserId(APIKey, userId).then(function (result) {
        dbResult = result;
    });

    while (dbResult === 0) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Citeste din baza de date modelele GamificationUserData asociate unei chei API.
 * @param {*} APIKey Cheia API a sistemului de gamificatie.
 * @returns Lista modelelor GamificationUserData asociate; null, daca nu am gasit niciun model asociat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationUserDatasByAPIKey(APIKey) {
    var dbResult = 0;
    await GamificationSystemExternalRepository.getGamificationUserDataByAPIKey(APIKey).then(function (result) {
        dbResult = result;
    });

    while (dbResult === 0) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Sterge din baza de date modelul GamificationUserData asociat cheii API, id-ului utilizatorului si recompensei cu un nume dat.
 * @param {*} APIKey Cheia API prin care s-a facut apelarea.
 * @param {*} userId Id-ul utilizatorului, dat de catre cel care a apelat API-ul extern.
 * @param {*} rewardName Numele recompensei, dat de catre cel care a apelat API-ul extern.
 * @returns 0, daca datele au fost sterse din baza de date; 1, daca nu am gasit niciun model GamificationSystem dupa cheia API/recompensa dupa nume; -1, daca a aparut o eroare pe parcursul executarii.
 */
async function deleteGamificationUserData(APIKey, userId, rewardName) {
    // Preiau modelul GamificationSystem din baza de date, folosindu-ma de cheia API
    var gamificationSystemModel = 0;
    await GamificationSystemServices.getGamificationSystemModelByAPIKey(APIKey).then(function (result) {
        gamificationSystemModel = result;
    })

    while (gamificationSystemModel === 0) {
        await utils.timeout(10);
    }

    if (gamificationSystemModel == null) return 1;
    if (gamificationSystemModel === -1) return -1;

    // Verific daca exista vreun model GamificationReward cu acest nume
    var tempList = gamificationSystemModel.listOfGamificationRewards.filter(rewardModel => rewardModel.name == rewardName);
    if (tempList.length === 0) return 1;

    var rewardModel = tempList[0];

    // Sterg datele din baza de date
    var dbResult = null;
    await GamificationSystemExternalRepository.deleteGamificationUserDataModel(
        new GamificationUserData(APIKey, userId, rewardModel.id, null)
    ).then(function (result) {
        dbResult = result;
    })

    while (dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Citeste din baza de date modelele GamificationUserData.
 * @returns Lista modelelor GamificationUserData; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationUserDatas() {
    var dbResult = 0;
    await GamificationSystemExternalRepository.getAllGamificationUserData().then(function (result) {
        dbResult = result;
    });

    while (dbResult === 0) {
        await utils.timeout(10);
    }

    return dbResult;
}


module.exports = {
    addGamificationUserDataToDatabase,
    deleteGamificationUserDataByAPIKey,
    getGamificationUserDataByUserId,
    deleteGamificationUserData,
    getGamificationUserDatasByAPIKey,
    getGamificationUserDatas
};