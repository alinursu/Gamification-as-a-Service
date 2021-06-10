const { checkUser, insertUser, setUserToken, checkUserEmail } = require('../database/tables/users')
const User = require('../models/user')
const conn = require('../database/connectionDb')
const GamificationController = require("./gamificationController");
const { parse } = require('querystring')
const { encrypt, decrypt } = require('../internal/hash');
const login = require('../routes/login');
const internalErr = require('../routes/error/500');

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
            (result) => {
                if(result.length === 0) {
                    req.errorMessage = 'Email-ul sau parola sunt incorecte!'
                    login(req, res)
                } else {
                    setUserToken(conn, user, parsedBody.remember, req, res).then(
                        (result) => {
                            console.log('setToken result: ', result)
                        },
                        (error) => {
                            console.log('setToken error', error)
                        })
                    res.writeHead(303, { 'Location' : '/'})
                    res.end()
                }
            },
            (error) => {
                console.log('DB Error:', error)
                res.statusCode = 500
                internalErr(req, res)
            })
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

        if(parsedBody.passReg !== parsedBody.confirmReg) {
            req.errorMessage = 'Parolele trebuie să coincidă'
            login(req, res)
            return;
        }

        let user = new User(null, encrypt(parsedBody.nameReg), encrypt(parsedBody.emailReg), encrypt(parsedBody.passReg))
        let queryResult = await checkUserEmail(conn, user)

        if(queryResult.length !== 0) {
            req.errorMessage = 'Acest email este deja înregistrat!'
            login(req, res)
        } else {
            insertUser(conn, user).then(
                async (result) => {
                    const gamificationController = new GamificationController(result.insertId);
                    await gamificationController.registered();
    
                    res.writeHead(303, {'Location': '/registerSuccess'})
                    res.end()
                },
                (error) => {
                    console.log('DB Error:', error)
                    res.statusCode = 500
                    internalErr(req, res)
                }
            )
        }


        
    })
}

module.exports = {
    handleLoginReq,
    handleRegisterReq
}