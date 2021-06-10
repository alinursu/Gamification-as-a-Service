const User = require("../../models/user");
const {decrypt} = require("../../internal/hash");
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

const checkUserEmail = (conn, user) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users WHERE email = ?', [user.email], (err, res) => {
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
            resolve(results)
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

const getUserById = (conn, id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
            if(err) {
                reject(err)
            }

            if(rows.length === 0) {
                resolve(null)
                return;
            }

            let user = new User(rows[0].id, decrypt(rows[0].name), decrypt(rows[0].email), decrypt(rows[0].password));
            resolve(user)
        })
    })
}

const getUserByToken = (conn, token) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users WHERE token = ?', [token], (err, rows) => {
            if(err) {
                reject(err)
            }

            if(rows.length === 0) {
                resolve(null)
                return;
            }

            let user = new User(rows[0].id, decrypt(rows[0].name), decrypt(rows[0].email), decrypt(rows[0].password));
            resolve(user)
        })
    })
}


module.exports = {
    selectAllUsers,
    insertUser,
    checkUser,
    setUserToken,
    getUserById,
    getUserByToken,
    checkUserEmail
}