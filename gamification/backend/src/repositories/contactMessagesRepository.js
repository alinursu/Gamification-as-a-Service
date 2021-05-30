const { getDatabaseConnection } = require('../internal/databaseConnection');
const hash = require('../internal/hash');
const utils = require('../internal/utils');

/**
 * Adauga un mesaj in baza de date.
 * @param {*} contactMessageModel Modelul mesajului care va fi adaugat in baza de date
 * @returns 1, daca mesajul a fost trimis; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addContactMessageToDatabase(contactMessageModel) {
    var connection = getDatabaseConnection();
    var sql = "INSERT INTO contact_messages(sender_name, sender_email, message) VALUES(?, ?, ?)";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(contactMessageModel.name), hash.encrypt(contactMessageModel.email), 
              hash.encrypt(contactMessageModel.text)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 1;
    })
    
    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

module.exports = {addContactMessageToDatabase};