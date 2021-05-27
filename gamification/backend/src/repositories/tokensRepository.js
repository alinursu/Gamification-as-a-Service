const { getDatabaseConnection } = require('../internal/databaseConnection');
const utils = require('../internal/utils');
const hash = require('../internal/hash');

/**
 * Adauga un token in baza de date, asociind-ul cu un anumit User.
 * @param {*} token Token-ul care va fi adaugat.
 * @param {*} userModel Utilizatorul cu care va fi asociat
 */
function addTokenToDatabase(token, userModel) {
    var actualDate = new Date();
    var expiresAtDate = actualDate.getFullYear() + "-" + (actualDate.getMonth() + 1) + "-" + (actualDate.getDate() + 1);

    var connection = getDatabaseConnection();
    // TODO: use parameterized query to avoid sql injection
    var sql = "INSERT INTO tokens VALUES('" + token + "', " + userModel.id + ", '" +
             hash.encrypt(userModel.firstname) + "', '" + hash.encrypt(userModel.lastname) + 
             "', STR_TO_DATE('" + expiresAtDate + "', '%Y-%m-%d'))";

    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

/**
 * Sterge un token din baa de date.
 * @param {*} token Token-ul care va fi sters.
 */
function deleteTokenFromDatabase(token) {
    var connection = getDatabaseConnection();
    // TODO: use parameterized query to avoid sql injection
    var sql = "DELETE FROM tokens WHERE token='" + token + "'";

    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

/**
 * Preia din baza de date id-ul utilizatorului asociat cu un token.
 * @param {*} token Token-ul dupa care se va face cautarea.
 * @returns Id-ul modelului User asociat token-ului dat; null, altfel
 */
async function getUserIdByToken(token) {
    // TODO: daca e null => error handling (in userController) (afisare user: nu am putut procesa cererea + logout) 
    var connection = getDatabaseConnection();
    // TODO: use parameterized query to avoid sql injection
    var sql = "SELECT user_id FROM tokens WHERE token='" + token + "'";

    connection.connect();

    var queryResult;
    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
        queryResult = results;
    })

    connection.end();

    while(queryResult == null) {
        await utils.timeout(10);
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
    // TODO: use parameterized query to avoid sql injection
    var sql = "DELETE FROM tokens WHERE expires_at=STR_TO_DATE('" + dateToday + "', '%Y-%m-%d')";

    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

module.exports = {addTokenToDatabase, deleteTokenFromDatabase, getUserIdByToken, deleteAllExpiredTokens}