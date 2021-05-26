const { getDatabaseConnection } = require('../internal/databaseConnection');
const utils = require('../internal/utils');

/**
 * Adauga un token in baza de date, asociind-ul cu un anumit User.
 * @param {*} token Token-ul care va fi adaugat.
 * @param {*} userModel Utilizatorul cu care va fi asociat
 */
function addTokenToDatabase(token, userModel) {
    var connection = getDatabaseConnection();
    // TODO: use parameterized query to avoid sql injection
    var sql = "INSERT INTO tokens VALUES('" + token + "', " + userModel.id + ", '" + userModel.firstname + "', '" + userModel.lastname + "')";

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

    await utils.timeout(1000);
    if(queryResult.length > 0) {
        return queryResult[0].user_id;
    }

    return null;
}

module.exports = {addTokenToDatabase, deleteTokenFromDatabase, getUserIdByToken}