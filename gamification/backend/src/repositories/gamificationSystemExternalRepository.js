const { getDatabaseConnection } = require('../internal/databaseConnection');
const hash = require('../internal/hash');
const utils = require('../internal/utils');
const GamificationUserData = require('../models/GamificationUserData');

/**
 * Selecteaza din baza de date informatiile unui utilizator legate de o anumita recompensa, intr-un anumit sistem de gamificare.
 * @param {*} APIKey Cheia API a sistemului de gamificare.
 * @param {*} userId Id-ul utilizatorului.
 * @param {*} rewardId Id-ul recompensei.
 * @returns Modelul GamificationUserData selectat; null, daca nu am gasit niciunul; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationUserData(APIKey, userId, rewardId) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_user_data WHERE system_api_key = ? AND user_id = ? AND reward_id = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey), userId, rewardId], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult == -1) return -1;

    if(queryResult.length > 0) {
        var gamificationUserDataModel = new GamificationUserData(
            hash.decrypt(queryResult[0].system_api_key), queryResult[0].user_id, 
                queryResult[0].reward_id, queryResult[0].progress
        );

        return gamificationUserDataModel;
    }

    return null;
}

/**
 * Selecteaza din baza de date informatiile despre utilizatorii unui anumit sistem de gamificare.
 * @param {*} APIKey Cheia API a sistemului de gamificare.
 * @returns Lista modelelor GamificationUserData selectate; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationUserDatasByAPIKey(APIKey) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_user_data WHERE system_api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult == -1) return -1;

    var outputList = [];
    queryResult.forEach(dbModel => {
        outputList.push(new GamificationUserData(
            hash.decrypt(dbModel.system_api_key), dbModel.user_id,
            dbModel.reward_id, dbModel.progress
        ))
    })

    return outputList;
}

/**
 * Insereaza un model GamificationUserData in baza de date.
 * @param {*} gamificationUserDataModel Modelul care va fi inserat.
 * @returns 0, daca acesta a fost inserat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function insertGamificationUserData(gamificationUserDataModel) {
    var connection = getDatabaseConnection();
    var sql = "INSERT INTO gamification_user_data VALUES(?, ?, ?, ?)";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(gamificationUserDataModel.APIKey), gamificationUserDataModel.userId, 
            gamificationUserDataModel.rewardId, gamificationUserDataModel.progress], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })
    
    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Actualizeaza un model GamificationUserData in baza de date.
 * @param {*} gamificationUserDataModel Modelul care va fi actualizat, avand noile informatii.
 * @returns 0, daca acesta a fost actualizat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function updateGamificationUserData(gamificationUserDataModel) {
    var connection = getDatabaseConnection();
    var sql = "UPDATE gamification_user_data SET progress = ? WHERE system_api_key = ? AND user_id = ? AND reward_id = ?";

    var queryResult = null;
    connection.query(sql, [gamificationUserDataModel.progress, hash.encrypt(gamificationUserDataModel.APIKey), gamificationUserDataModel.userId, 
            gamificationUserDataModel.rewardId], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })
    
    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Sterge din baza de date toate datele legate de progresele utilizatorilor intr-un sistem de gamificatie.
 * @param {*} APIKey Cheia API a sistemului de gamificatie.
 * @returns 0, daca datele au fost sterse; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteGamificationUserDataByAPIKey(APIKey) {
    var connection = getDatabaseConnection();
    var sql = "DELETE FROM gamification_user_data WHERE system_api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })
    
    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Citeste din baza de date modelele GamificationUserData asociate unui id de utilizator.
 * @param {*} APIKey Cheia API a sistemului de gamificatie.
 * @param {*} userId Id-ul utilizatorului dupa care se face cautarea.
 * @returns Lista modelelor GamificationUserData asociate; null, daca nu am gasit niciun model asociat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getGamificationUserDataByUserId(APIKey, userId) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_user_data WHERE system_api_key = ? AND user_id = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey), userId], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult == -1) return -1;

    if(queryResult.length > 0) {
        var outputList = []
        for(var i=0; i<queryResult.length; i++) {
            var gamificationUserDataModel = new GamificationUserData(
                hash.decrypt(queryResult[i].system_api_key), queryResult[i].user_id, 
                    queryResult[i].reward_id, queryResult[i].progress
            );
            outputList.push(gamificationUserDataModel);
        }
        
        return outputList;
    }

    return null;
}

/**
 * Sterge din baza de date toate datele un model GamificaitonUserData.
 * @param {*} gamificationUserData Modelul care va fi sters.
 * @returns 0, daca acesta a fost sters; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteGamificationUserDataModel(gamificationUserData) {
    var connection = getDatabaseConnection();
    var sql = "DELETE FROM gamification_user_data WHERE system_api_key = ? AND user_id = ? AND reward_id = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(gamificationUserData.APIKey), gamificationUserData.userId, gamificationUserData.rewardId], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })
    
    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

module.exports = {getGamificationUserData, insertGamificationUserData, updateGamificationUserData,
    deleteGamificationUserDataByAPIKey, getGamificationUserDataByUserId, deleteGamificationUserDataModel,
    getGamificationUserDatasByAPIKey};