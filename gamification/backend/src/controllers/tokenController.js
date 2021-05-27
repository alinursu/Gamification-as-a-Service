const tokensRepository = require("../repositories/tokensRepository");

/**
 * Sterge din baza de date toti tokenii care au expirat.
 */
async function deleteAllExpiredTokens() {
    await tokensRepository.deleteAllExpiredTokens();
}

module.exports = {deleteAllExpiredTokens};