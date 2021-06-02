const {getDatabaseConnection} = require('../internal/databaseConnection');
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

    var queryResult = null;
    connection.query(sql, [userId], function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    });

    while (queryResult == null) {
        await utils.timeout(10);
    }

    // Decriptez datele
    queryResult.forEach(gamificationSystemModel => {
        gamificationSystemModel.api_key = hash.decrypt(gamificationSystemModel.api_key);
        gamificationSystemModel.name = hash.decrypt(gamificationSystemModel.name);
    });

    return queryResult;
}

async function getGamificationSystemByApiKey(apiKey) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_systems WHERE api_key=?";


    var queryResult;
    connection.query(sql, [hash.encrypt(apiKey)], function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }
        queryResult = results;
    });

    while (queryResult == null) {
        await utils.timeout(10);
    }

    if (queryResult === -1) {
        return -1;
    }

    if (queryResult.length > 0) {
        var systemModel = new GamificationSystemModel(
            hash.decrypt(queryResult[0].api_key), hash.decrypt(queryResult[0].name), queryResult[0].user_id, null, null);
        return systemModel;
    }
    return null;
}

/**
 * Cauta in baza de date modelele GamificationReward create pentru un anumit sistem.
 * @param {*} systemAPIKey Cheia API a sistemului de gamificare.
 * @return Lista modelelor GamificationReward; -1, daca a aparut o eroare pe parcursul executiei
 */
async function getGamificationRewardModelsByAPIKey(systemAPIKey) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_rewards WHERE system_api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(systemAPIKey)], function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    });

    while (queryResult == null) {
        await utils.timeout(10);
    }

    // Decriptez datele
    queryResult.forEach(gamificationRewardModel => {
        gamificationRewardModel.system_api_key = hash.decrypt(gamificationRewardModel.system_api_key);
        gamificationRewardModel.name = hash.decrypt(gamificationRewardModel.name);
    });

    return queryResult;
}

/**
 * Cauta in baza de date modelele GamificationEvent create pentru un anumit sistem.
 * @param {*} systemAPIKey Cheia API a sistemului de gamificare.
 * @return Lista modelelor GamificationEvent; -1, daca a aparut o eroare pe parcursul executiei
 */
async function getGamificationEventModelsByAPIKey(systemAPIKey) {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM gamification_events WHERE system_api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(systemAPIKey)], function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    });

    while (queryResult == null) {
        await utils.timeout(10);
    }

    // Decriptez datele
    queryResult.forEach(gamificationEventModel => {
        gamificationEventModel.system_api_key = hash.decrypt(gamificationEventModel.system_api_key);
        gamificationEventModel.name = hash.decrypt(gamificationEventModel.name);
    });

    return queryResult;
}

async function getAllSystems() {
    const connection = getDatabaseConnection();
    const sql = "SELECT * from gamification_systems";

    return new Promise((resolve, reject) => {
        connection.query(sql, [], (err, results) => {
            if (err) {
                console.log(err);
                resolve([]);
            } else {
                const systems = results.map(result => {
                    return new GamificationSystemModel(hash.decrypt(result.api_key), hash.decrypt(result.name),
                        result.user_id);
                });
                resolve(systems);
            }
        })
    })
}

async function deleteSystemByApi(api_key) {
    const connection = getDatabaseConnection();
    const sql = "DELETE FROM gamification_systems WHERE api_key=?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [api_key], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

async function updateSystemModel(systemModel) {
    const connection = getDatabaseConnection();
    const sql = "UPDATE gamification_systems SET api_key=?, user_id=?, name=? WHERE api_key=?";
    return new Promise((resolve, reject) => {
        connection.query(sql, [hash.encrypt(systemModel.APIKey), systemModel.userId, hash.encrypt(systemModel.name), hash.encrypt(systemModel.APIKey)], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

/**
 * Adauga sistemul de gamificare in tabela "gamification_systems".
 * @param {*} gamificationSystemModel Sistemul de recompense care va fi adaugat.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (poate fi null).
 * @returns 0, daca acesta a fost adaugat; 1, daca cheia API a mai fost folosita (ER_DUP_ENTRY); -1, daca a aparut o eroare pe parcursul executiei
 */
async function addGamificationSystemToDatabase(gamificationSystemModel, connection = null) {
    if (connection == null) {
        connection = getDatabaseConnection();
    }
    var sql = "INSERT INTO gamification_systems VALUES(?, ?, ?)";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(gamificationSystemModel.APIKey), gamificationSystemModel.userId,
        hash.encrypt(gamificationSystemModel.name)], function (error, results) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') { // Primary key constraint violation handling
                queryResult = 1;
                return;
            }

            queryResult = -1;
            return;
        }

        queryResult = 0;
    })

    while (queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Adauga un eveniment in tabela "gamification_events".
 * @param {*} gamificationEventModel Modelul-eveniment care va fi adaugat.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (poate fi null).
 * @returns 0, daca acesta a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addGamificationEventToDatabase(gamificationEventModel, connection = null) {
    if (connection == null) {
        connection = getDatabaseConnection();
    }
    if(gamificationEventModel.id == null) {
        var sql = "INSERT INTO gamification_events(system_api_key, name, event_type) VALUES(?, ?, ?)";
        var params = [hash.encrypt(gamificationEventModel.systemAPIKey), hash.encrypt(gamificationEventModel.name),
            gamificationEventModel.eventType];
    }
    else {
        var sql = "INSERT INTO gamification_events VALUES (?, ?, ?, ?)";
        var params = [gamificationEventModel.id, hash.encrypt(gamificationEventModel.systemAPIKey), hash.encrypt(gamificationEventModel.name),
            gamificationEventModel.eventType]
    }

    var queryResult = null;
    connection.query(sql, params, function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })

    while (queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Adauga un eveniment in tabela "gamification_rewards".
 * @param {*} gamificationRewardModel Modelul-recompensa care va fi adaugat.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (poate fi null).
 * @returns 0, daca acesta a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addGamificationRewardToDatabase(gamificationRewardModel, connection = null) {
    if (connection == null) {
        connection = getDatabaseConnection();
    }

    if(gamificationRewardModel.id == null) {
        var sql = "INSERT INTO gamification_rewards(system_api_key, name, type, occurs_at_event_id, event_value, reward_value) VALUES(?, ?, ?, ?, ?, ?)";
        var params = [hash.encrypt(gamificationRewardModel.systemAPIKey), hash.encrypt(gamificationRewardModel.name), gamificationRewardModel.type,
            gamificationRewardModel.eventId, gamificationRewardModel.eventValue, gamificationRewardModel.rewardValue];
    }
    else {
        var sql = "INSERT INTO gamification_rewards VALUES(?, ?, ?, ?, ?, ?, ?)";
        var params = [gamificationRewardModel.id, hash.encrypt(gamificationRewardModel.systemAPIKey), hash.encrypt(gamificationRewardModel.name), gamificationRewardModel.type,
            gamificationRewardModel.eventId, gamificationRewardModel.eventValue, gamificationRewardModel.rewardValue];
    }

    var queryResult = null;
    connection.query(sql, params, function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    })

    while (queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Cauta in baza de date un eveniment dupa o cheie API (a unui sistem de gamificare) si un nume.
 * @param {*} APIKey Cheia API a sistemului de gamificare dupa care se face cautarea.
 * @param {*} name Numele dupa care se face cautarea.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (poate fi null).
 * @return Evenimentul gasit; NULL, daca nu exista niciun eveniment care sa corespunda criteriilor; -1, daca a aparut o eroare pe parcursul executiei
 */
async function getGamificationEventByAPIKeyAndName(APIKey, name, connection = null) {
    if (connection == null) {
        connection = getDatabaseConnection();
    }
    var sql = "SELECT * FROM gamification_events WHERE system_api_key = ? AND name = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey), hash.encrypt(name)], function (error, results) {
        if (error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    });

    while (queryResult == null) {
        await utils.timeout(10);
    }

    if (queryResult.length > 0) {
        return queryResult[0];
    }

    return null;
}

/**
 * Sterge din baza de date toate modelele GamificationReward care sunt asociate unei chei API.
 * @param {*} APIKey Cheia API dupa care se face cautarea.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (by default, null).
 * @returns 0, daca modelele au fost sterse; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteAllGamificationRewardsByAPIKey(APIKey, connection = null) {
    if(connection == null) {
        connection = getDatabaseConnection();
    }
    var sql = "DELETE FROM gamification_rewards WHERE system_api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey)], function (error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    });

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Sterge din baza de date toate modelele GamificationEvent care sunt asociate unei chei API.
 * @param {*} APIKey Cheia API dupa care se face cautarea.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (by default, null).
 * @returns 0, daca modelele au fost sterse; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteAllGamificationEventsByAPIKey(APIKey, connection = null) {
    if(connection == null) {
        connection = getDatabaseConnection();
    }
    var sql = "DELETE FROM gamification_events WHERE system_api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey)], function (error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    });

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Sterge din baza de date modelul GamificationSystem care este asociat unei chei API.
 * @param {*} APIKey Cheia API dupa care se face cautarea.
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (by default, null).
 * @returns 0, daca modelul a fost sters; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteGamificationSystemByAPIKey(APIKey, connection = null) {
    if(connection == null) {
        connection = getDatabaseConnection();
    }
    var sql = "DELETE FROM gamification_systems WHERE api_key = ?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(APIKey)], function (error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 0;
    });

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

module.exports = {
    getGamificationSystemsByUserId,
    addGamificationSystemToDatabase,
    addGamificationEventToDatabase,
    addGamificationRewardToDatabase,
    getGamificationEventByAPIKeyAndName,
    getGamificationRewardModelsByAPIKey,
    getGamificationEventModelsByAPIKey,
    getAllSystems,
    deleteSystemByApi,
    getGamificationSystemByApiKey,
    updateSystemModel,
    deleteAllGamificationEventsByAPIKey,
    deleteAllGamificationRewardsByAPIKey,
    deleteGamificationSystemByAPIKey
};