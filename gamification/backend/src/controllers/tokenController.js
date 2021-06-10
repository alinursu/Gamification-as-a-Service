const TokensServices = require("../services/tokensServices");

/**
 * Sterge din baza de date toti tokenii care au expirat.
 */
async function deleteAllExpiredTokens() {
    await TokensServices.deleteAllExpiredTokens();
}

module.exports = {deleteAllExpiredTokens};