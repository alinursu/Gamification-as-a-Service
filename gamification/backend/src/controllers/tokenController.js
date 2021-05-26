const tokensRepository = require("../repositories/tokensRepository");

/**
 * Sterge din baza de date toti tokenii care au expirat.
 */
function deleteAllExpiredTokens() {
    tokensRepository.deleteAllExpiredTokens();
}

module.exports = {deleteAllExpiredTokens};