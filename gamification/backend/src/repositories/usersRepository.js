const { getDatabaseConnection } = require('../internal/databaseConnection');
const utils = require('../internal/utils');
const UserModel = require('../models/User');

/**
 * Verifica daca datele de conectare dintr-un model User sunt valide.
 * @param {*} userModel Modelul a caror date de conectare vor fi verificate.
 * @returns Modelul User din baza de date, daca datele de conectare sunt valide; null, altfel
 */
async function verifyUserModelLoginCredentials(userModel) {
    var connection = getDatabaseConnection(); 
    // TODO: use parameterized query to avoid sql injection
    var sql = "SELECT * FROM users WHERE email='" + userModel.email + "' AND password='" + userModel.password + "'";
    
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
        return queryResult[0];
    }

    return null;
}

/**
 * Verifica daca exista in baza de date deja un model cu email-ul userModel.email.
 * @param {*} userModel Modelul creat cu datele introduse de utilizator
 * @returns 1, daca exista; 0, altfel
 */
async function verifyUserModelRegisterCredentials(userModel) {
    var connection = getDatabaseConnection(); 
    // TODO: use parameterized query to avoid sql injection
    var sql = "SELECT * FROM users WHERE email='" + userModel.email + "'";
    
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
        return 1;
    }

    return 0;
}

/**
 * Adauga un model User in baza de date.
 * @param {*} userModel Modelul care va fi adaugat.
 */
function insertUserModel(userModel) {
    var connection = getDatabaseConnection(); 
    // TODO: use parameterized query to avoid sql injection
    var sql = "INSERT INTO users(firstname, lastname, email, password, url) VALUES('" + userModel.firstname + "', '" + userModel.lastname + "', '" + userModel.email + "', '" + userModel.password + "', '" + userModel.url + "')";
    
    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

/**
 * Preia din baza de date un model user pe baza unui id.
 * @param {*} userId Id-ul dupa care se face cautarea
 * @returns Modelul User gasit; null, altfel
 */
async function getUserModelById(userId) {
    var connection = getDatabaseConnection(); 
    // TODO: use parameterized query to avoid sql injection
    var sql = "SELECT * from users WHERE id=" + userId;

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
        var userModel = new UserModel(queryResult[0].id, queryResult[0].lastname, queryResult[0].firstname, queryResult[0].email, queryResult[0].password, queryResult[0].url);
        return userModel;
    }

    return null;
}

/**
 * Actualizeaza campul "url" al modelului User din baza de date.
 * @param {*} userModel Modelul User, continand noua valoare in campul dedicat pentru "url".
 */
function updateUserModelURL(userModel) {
    var connection = getDatabaseConnection(); 
    // TODO: use parameterized query to avoid sql injection
    var sql = "UPDATE users SET url='" + userModel.url + "' WHERE id=" + userModel.id;

    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

/**
 * Actualizeaza campul "password" al modelului User din baza de date.
 * @param {*} userModel Modelul User, continand noua valoare in campul dedicat pentru "password".
 */
function updateUserModelPassword(userModel) {
    var connection = getDatabaseConnection(); 
    // TODO: use parameterized query to avoid sql injection
    var sql = "UPDATE users SET password='" + userModel.password + "' WHERE id=" + userModel.id;

    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

module.exports = {verifyUserModelLoginCredentials, verifyUserModelRegisterCredentials, insertUserModel, getUserModelById, updateUserModelURL, updateUserModelPassword};