/**
 * Preia din baza de date toate modelele Token din baza de date.
 * @returns Lista modelelor Token; -1, daca a aparut o eroare pe parcursul executiei.
 */
const TokensRepository = require("../repositories/TokensRepository");

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

module.exports = {getAllTokens};