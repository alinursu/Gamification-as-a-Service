const { getDatabaseConnection } = require('../internal/databaseConnection');
const utils = require('../internal/utils');
const GamificationEventModel = require('../models/GamificationEvent');
const GamificationRewardModel = require('../models/GamificationReward');
const GamificationSystemModel = require('../models/GamificationSystem');
const hash = require('../internal/hash');

/**
 * Cauta in baza de date sistemele de gamificare create de un anumit utilizator.
 * @param {*} userId Id-ul utilizatorului.
 * @return Lista sistemelor de gamificare create de acesta; -1, daca a aparut o eroare pe parcursul executiei
 */
async function getGamificationSystemsByUserId(userId) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_systems WHERE user_id = ?";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [userId], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    });

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    // Decriptez datele
    queryResult.forEach(gamificationSystemModel => {
        gamificationSystemModel.APIKey = hash.decrypt(gamificationSystemModel.APIKey);
        gamificationSystemModel.name = hash.decrypt(gamificationSystemModel.name);

        gamificationSystemModel.listOfGamificationEvents.forEach(gamificationEventModel => {
            gamificationEventModel.systemAPIKey = hash.decrypt(gamificationEventModel.systemAPIKey);
            gamificationEventModel.name = hash.decrypt(gamificationEventModel.name);
        });

        gamificationSystemModel.listOfGamificationRewards.forEach(gamificationRewardModel => {
            gamificationRewardModel.systemAPIKey = hash.decrypt(gamificationRewardModel.systemAPIKey);
            gamificationRewardModel.name = hash.decrypt(gamificationRewardModel.name);
        });
    });

    return queryResult;
}

/**
 * Adauga sistemul de gamificare in tabela "gamification_systems".
 * @param {*} gamificationSystemModel Sistemul de recompense care va fi adaugat.
 * @returns 0, daca acesta a fost adaugat; 1, daca cheia API a mai fost folosita (ER_DUP_ENTRY); -1, daca a aparut o eroare pe parcursul executiei
 */
async function addGamificationSystemToDatabase(gamificationSystemModel) {
    var connection = getDatabaseConnection();
    var sql = "INSERT INTO gamification_systems VALUES(?, ?, ?)";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [hash.encrypt(gamificationSystemModel.APIKey), hash.encrypt(gamificationSystemModel.name), 
            gamificationSystemModel.userId], function(error, results) {
        if(error) {
            if(error.code === 'ER_DUP_ENTRY') { // Primary key constraint violation handling
                queryResult = 1;
                return;
            }

            queryResult = -1;
            return;
        }

        queryResult = 0;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Adauga un eveniment in tabela "gamification_events".
 * @param {*} gamificationEventModel Modelul-eveniment care va fi adaugat.
 * @returns 0, daca acesta a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addGamificationEventToDatabase(gamificationEventModel) {
    var connection = getDatabaseConnection();
    var sql = "INSERT INTO gamification_events(system_api_key, name, event_type) VALUES(?, ?, ?)";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [hash.encrypt(gamificationEventModel.systemAPIKey), hash.encrypt(gamificationEventModel.name), 
            gamificationEventModel.eventType], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Adauga un eveniment in tabela "gamification_rewards".
 * @param {*} gamificationRewardModel Modelul-recompensa care va fi adaugat.
 * @returns 0, daca acesta a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addGamificationRewardToDatabase(gamificationRewardModel) {
    var connection = getDatabaseConnection();
    var sql = "INSERT INTO gamification_rewards(system_api_key, name, type, occurs_at_event_id, value) VALUES(?, ?, ?, ?, ?)";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [hash.encrypt(gamificationRewardModel.systemAPIKey), hash.encrypt(gamificationRewardModel.name), gamificationRewardModel.type,
            gamificationRewardModel.eventId, gamificationRewardModel.value], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }
        
        queryResult = 0;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Cauta in baza de date un eveniment dupa o cheie API (a unui sistem de gamificare) si un nume.
 * @param {*} APIKey Cheia API a sistemului de gamificare dupa care se face cautarea
 * @param {*} name Numele dupa care se face cautarea.
 * @return Evenimentul gasit; NULL, daca nu exista niciun eveniment care sa corespunda criteriilor; -1, daca a aparut o eroare pe parcursul executiei
 */
async function getGamificationEventByAPIKeyAndName(APIKey, name) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_events WHERE system_api_key = ? AND name = ?";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey), hash.encrypt(name)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    });

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult.length > 0) {
        return queryResult[0];
    }

    return null;
}

module.exports = {getGamificationSystemsByUserId, addGamificationSystemToDatabase, 
    addGamificationEventToDatabase, addGamificationRewardToDatabase, getGamificationEventByAPIKeyAndName};