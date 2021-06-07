/**
 * Preia din baza de date toate modelele Token din baza de date.
 * @returns Lista modelelor Token; -1, daca a aparut o eroare pe parcursul executiei.
 */
const tokensRepository = require("../repositories/tokensRepository");

async function getAllTokens() {
    var dbResult = null;
    await tokensRepository.getAllTokens().then(function (result) {
        dbResult = result;
    });

    while(dbResult == null) {
        await utils.timeout(10);
    }

    console.log(dbResult);

    return dbResult;
}

module.exports = {getAllTokens};