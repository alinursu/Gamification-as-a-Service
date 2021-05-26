const { getDatabaseConnection } = require('../internal/databaseConnection');

/**
 * Adauga un mesaj in baza de date.
 * @param {*} contactMessageModel Modelul mesajului care va fi adaugat in baza de date
 */
function addContactMessageToDatabase(contactMessageModel) {
    var connection = getDatabaseConnection();
    // TODO: use parameterized query to avoid sql injection
    var sql = "INSERT INTO contact_messages(sender_name, sender_email, message) VALUES('" + contactMessageModel.name + "', '" + contactMessageModel.email + "', '" + contactMessageModel.text + "')";

    connection.connect();

    connection.query(sql, function(error, results) {
        if(error) throw error; // TODO: error handling
    })

    connection.end();
}

module.exports = {addContactMessageToDatabase};