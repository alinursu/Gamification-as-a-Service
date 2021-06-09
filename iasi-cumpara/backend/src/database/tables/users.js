const { encrypt } = require("../../internal/hash")
const { generateAuthCookie } = require('../../services/authService')

const selectAllUsers = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users', (err, rows) => {
            if(err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

const checkUser = (conn, user) => {
    return new Promise((resolve,reject) => {
        conn.query('SELECT * FROM users WHERE email = ? AND password = ?', [encrypt(user.email), encrypt(user.password)], (err, res) => {
            if(err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

const insertUser = (conn, user) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO users SET ?', user, (err, results, fields) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}

const setUserToken = (conn, user, req, res) => {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE users SET token = ? WHERE email = ? AND password = ?',
        [generateAuthCookie(req, res), encrypt(user.email), encrypt(user.password)], 
        (error, result) => {
            if(error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

module.exports = {
    selectAllUsers,
    insertUser,
    checkUser,
    setUserToken
}