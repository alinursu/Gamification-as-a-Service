var mysql = require('mysql'); 

// TODO: Restore online database connectivity
// var connectionPool = mysql.createPool({
//     connectionLimit: 20,
//     host: 'sql11.freemysqlhosting.net',
//     user: 'sql11416342',
//     password: 'BH9I96VfLc',
//     port: '3306',
//     database: 'sql11416342'
// });

var connectionPool = mysql.createPool({
    connectionLimit: 15,
    host: 'localhost',
    user: 'GamSuser',
    password: 'GamSPwd!',
    port: '3306',
    database: 'sql11416342'
});

/**
 * @returns Pool-ul de conexiuni cu bazei de date.
 */
function getDatabaseConnection() {
    return connectionPool;
}

module.exports = {getDatabaseConnection};