const { getDatabaseConnection } = require('../internal/databaseConnection');
const utils = require('../internal/utils');
const hash = require('../internal/hash');

/**
 * Adauga un token in baza de date, asociind-ul cu un anumit User.
 * @param {*} token Token-ul care va fi adaugat.
 * @param {*} userModel Utilizatorul cu care va fi asociat
 * @returns 1, daca token-ul a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addTokenToDatabase(token, userModel) {
    var actualDate = new Date();
    var expiresAtDate = actualDate.getFullYear() + "-" + (actualDate.getMonth() + 1) + "-" + (actualDate.getDate() + 1);

    var connection = getDatabaseConnection();
    var sql = "INSERT INTO tokens VALUES(?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'))";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [token, userModel.id, hash.encrypt(userModel.firstname), 
            hash.encrypt(userModel.lastname), expiresAtDate], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 1;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Sterge un token din baa de date.
 * @param {*} token Token-ul care va fi sters.
 * @returns 1, daca token-ul a fost sters; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteTokenFromDatabase(token) {
    var connection = getDatabaseConnection();
    var sql = "DELETE FROM tokens WHERE token=?";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [token], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 1;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

/**
 * Preia din baza de date id-ul utilizatorului asociat cu un token.
 * @param {*} token Token-ul dupa care se va face cautarea.
 * @returns Id-ul modelului User asociat token-ului dat; null, altfel; -1, daca a aparut o eraore pe parcursul executiei.
 */
async function getUserIdByToken(token) {
    // TODO: daca returneaza null => error handling (in userController) (afisare user: nu am putut procesa cererea + logout) 
    var connection = getDatabaseConnection();
    var sql = "SELECT user_id FROM tokens WHERE token=?";

    connection.connect();

    var queryResult = null;
    connection.query(sql, [token], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }
        queryResult = results;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult == -1) {
        return -1;
    }
    
    if(queryResult.length > 0) {
        return queryResult[0].user_id;
    }

    return null;
}

/**
 * Sterge din baza de date toti tokenii care au expirat.
 */
async function deleteAllExpiredTokens() {
    var actualDate = new Date();
    var dateToday = actualDate.getFullYear() + "-" + (actualDate.getMonth() + 1) + "-" + actualDate.getDate();

    var connection = getDatabaseConnection();
    var sql = "DELETE FROM tokens WHERE expires_at=STR_TO_DATE(?, '%Y-%m-%d')";

    connection.connect();

    connection.query(sql, [dateToday], function(error, results) {
        if(error) return;
    })

    connection.end();
}

module.exports = {addTokenToDatabase, deleteTokenFromDatabase, getUserIdByToken, deleteAllExpiredTokens}