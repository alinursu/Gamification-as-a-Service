const { getDatabaseConnection } = require('../internal/databaseConnection');
const utils = require('../internal/utils');
const UserModel = require('../models/User');
const hash = require('../internal/hash');

/**
 * Verifica daca datele de conectare dintr-un model User sunt valide.
 * @param {*} userModel Modelul a caror date de conectare vor fi verificate.
 * @returns Modelul User din baza de date, daca datele de conectare sunt valide; null, altfel; -1, daca a aparut o eroare pe parcursul executarii
 */
async function verifyUserModelLoginCredentials(userModel) {
    var connection = getDatabaseConnection(); 
    var sql = "SELECT * FROM users WHERE email=? AND password=?";

    var queryResult;
    connection.query(sql, [hash.encrypt(userModel.email), hash.encrypt(userModel.password)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }
        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult == -1) {
        return -1;
    }

    if(queryResult.length > 0) {
        var userModel = new UserModel(
            queryResult[0].id, hash.decrypt(queryResult[0].lastname), hash.decrypt(queryResult[0].firstname), 
                hash.decrypt(queryResult[0].email), hash.decrypt(queryResult[0].password), hash.decrypt(queryResult[0].url)
        );
        return userModel;
    }

    return null;
}

/**
 * Verifica daca exista in baza de date deja un model cu email-ul userModel.email.
 * @param {*} userModel Modelul creat cu datele introduse de utilizator
 * @returns 1, daca exista; 0, altfel; -1, daca a aparut o eroare pe parcursul executarii
 */
async function verifyUserModelRegisterCredentials(userModel) {
    var connection = getDatabaseConnection(); 
    var sql = "SELECT * FROM users WHERE email=?";

    var queryResult;
    connection.query(sql, [hash.encrypt(userModel.email)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }
        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }

    if(queryResult == -1) {
        return -1;
    }

    if(queryResult.length > 0) {
        return 1;
    }

    return 0;
}

/**
 * Adauga un model User in baza de date.
 * @param {*} userModel Modelul care va fi adaugat.
 * @returns 0, daca a fost adaugat modelul; -1, daca a aparut o eroare pe parcursul executarii
 */
async function insertUserModel(userModel) {
    var connection = getDatabaseConnection();
    var sql = "INSERT INTO users(firstname, lastname, email, password, url) VALUES(?, ?, ?, ?, ?)";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(userModel.firstname), hash.encrypt(userModel.lastname), hash.encrypt(userModel.email), 
             hash.encrypt(userModel.password), hash.encrypt(userModel.url)], function(error, results) {
        if(error)  {
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
 * Preia din baza de date un model user pe baza unui id.
 * @param {*} userId Id-ul dupa care se face cautarea
 * @returns Modelul User gasit; null, altfel; -1, daca a aparut o eroare pe parcursul executarii
 */
async function getUserModelById(userId) {
    var connection = getDatabaseConnection(); 
    var sql = "SELECT * from users WHERE id=?";

    var queryResult;
    connection.query(sql, [userId], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }
        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }
    
    if(queryResult == -1) {
        return -1;
    }
    
    if(queryResult.length > 0) {
        var userModel = new UserModel(
            queryResult[0].id, hash.decrypt(queryResult[0].lastname), hash.decrypt(queryResult[0].firstname), 
                hash.decrypt(queryResult[0].email), hash.decrypt(queryResult[0].password), hash.decrypt(queryResult[0].url)
        );
        return userModel;
    }

    return null;
}

/**
 * Actualizeaza campul "url" al modelului User din baza de date.
 * @param {*} userModel Modelul User, continand noua valoare in campul dedicat pentru "url".
 * @returns 0, daca a fost updatat modelul; -1, daca a aparut o eroare pe parcursul executarii
 */
async function updateUserModelURL(userModel) {
    var connection = getDatabaseConnection(); 
    var sql = "UPDATE users SET url=? WHERE id=?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(userModel.url), userModel.id], function(error, results) {
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
 * Actualizeaza campul "password" al modelului User din baza de date.
 * @param {*} userModel Modelul User, continand noua valoare in campul dedicat pentru "password".
 * @returns 0, daca modelul a fost actualizat; -1, daca a aparut o eroare pe parcursul executarii
 */
async function updateUserModelPassword(userModel) {
    var connection = getDatabaseConnection(); 
    var sql = "UPDATE users SET password=? WHERE id=?";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(userModel.password), userModel.id], function(error, results) {
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

module.exports = {verifyUserModelLoginCredentials, verifyUserModelRegisterCredentials, insertUserModel, getUserModelById, updateUserModelURL, updateUserModelPassword};