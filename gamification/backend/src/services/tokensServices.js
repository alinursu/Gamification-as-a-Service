const TokensRepository = require("../repositories/tokensRepository");
const utils = require("../internal/utils");

/**
 * Preia din baza de date toate modelele Token din baza de date.
 * @returns Lista modelelor Token; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getAllTokens() {
    var dbResult = null;
    await TokensRepository.getAllTokens().then(function (result) {
        dbResult = result;
    });

    while(dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

async function deleteAllExpiredTokens() {
    await TokensRepository.deleteAllExpiredTokens();
}

/**
 * Preia din baza de date id-ul utilizatorului asociat cu un token.
 * @param {*} token Token-ul dupa care se va face cautarea.
 * @returns Id-ul modelului User asociat token-ului dat; null, altfel; -1, daca a aparut o eraore pe parcursul executiei.
 */
async function getUserIdByToken(token) {
    var dbResult = 0;
    await TokensRepository.getUserIdByToken(token).then(function (result) {
        dbResult = result;
    })

    while(dbResult === 0) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Adauga un token in baza de date, asociind-ul cu un anumit User.
 * @param {*} token Token-ul care va fi adaugat.
 * @param {*} userModel Utilizatorul cu care va fi asociat
 * @returns 1, daca token-ul a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addTokenToDatabase(token, userModel) {
    var dbResult = null;
    await TokensRepository.addTokenToDatabase(token, userModel).then(function (result) {
        dbResult = result;
    })

    while(dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

/**
 * Sterge un token din baa de date.
 * @param {*} token Token-ul care va fi sters.
 * @returns 1, daca token-ul a fost sters; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function deleteToken(token) {
    var dbResult = null;
    await TokensRepository.deleteToken(token).then(function (result) {
        dbResult = result;
    })

    while(dbResult == null) {
        await utils.timeout(10);
    }

    return dbResult;
}

module.exports = {getAllTokens, deleteAllExpiredTokens, getUserIdByToken, addTokenToDatabase,
    deleteToken};