var mysql = require('mysql'); 

var connectionPool = mysql.createPool({
    connectionLimit: 50,
    host: 'sql11.freemysqlhosting.net',
    user: 'sql11414921',
    password: 'UbkEDpKNE5',
    port: '3306',
    database: 'sql11414921'
});

/**
 * @returns Pool-ul de conexiuni cu bazei de date.
 */
function getDatabaseConnection() {
    return connectionPool;
}

module.exports = {getDatabaseConnection};