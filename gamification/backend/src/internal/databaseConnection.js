var mysql = require('mysql'); 

/**
 * Stabileste o conexiune cu baza de date daca nu a fost creata deja una.
 * @returns Conexiunea cu baza de date.
 */
function getDatabaseConnection() {
    var connection = mysql.createConnection({
        host: 'sql11.freemysqlhosting.net',
        user: 'sql11414921',
        password: 'UbkEDpKNE5',
        port: '3306',
        database: 'sql11414921'
    });

    return connection;
}

module.exports = {getDatabaseConnection};