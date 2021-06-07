const TokensRepository = require("../repositories/TokensRepository");

/**
 * Sterge din baza de date toti tokenii care au expirat.
 */
async function deleteAllExpiredTokens() {
    await TokensRepository.deleteAllExpiredTokens();
}

module.exports = {deleteAllExpiredTokens};