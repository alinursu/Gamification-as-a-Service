const { checkUser, insertUser } = require('../database/tables/users')
const User = require('../models/user')
const conn = require('../database/connectionDb')
const { parse } = require('querystring')
const { encrypt, decrypt } = require('../internal/hash')

const handleLoginReq = (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    let parsedBody
    req.on('end', async () =>{
        parsedBody = parse(body)
        let user = new User(null, null, parsedBody.emailLog, parsedBody.passLog)

        checkUser(conn, user).then(
            (res) => {
                console.log(res)
            },
            (err) => {
                console.log(err)
            }
        )


        res.writeHead(303, {'Location': '/'})
        res.end()
    })
}

const handleRegisterReq = (req, res) => {
    let body = ''

    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    let parsedBody
    req.on('end', async () =>{
        parsedBody = parse(body)

        let user = new User(null, encrypt(parsedBody.nameReg), encrypt(parsedBody.emailReg), encrypt(parsedBody.passReg))

        insertUser(conn, user).then(
            res => {
                console.log(res)
            },
            err => {
                console.log(err)
            }
        )

        res.end()
    })
}

module.exports = {
    handleLoginReq,
    handleRegisterReq
}