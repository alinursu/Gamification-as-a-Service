const selectAllUsers = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users', (err, rows) => {
            if(err) {
                reject(err)
            }
            resolve(rows);
        })
    })
}

const insertUser = (conn, firstname, lastname, email, password) => {
    const user = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password
    }

    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO isc_users SET ?', user, (err, results, fields) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}

module.exports = {
    selectAllUsers,
    insertUser
}