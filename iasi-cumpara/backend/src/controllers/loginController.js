const { checkUser, insertUser, setUserToken } = require('../database/tables/users')
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
            (result) => {
                console.log('DB Result', result)
                if(result.length === 0) {
                    console.log('not registered')
                    // return { statusCode: 401, location: '/login'}
                    res.writeHead(303, { 'Location' : '/login'})
                    alert('Email or password are incorrect!')
                    res.end()
                } else {
                    console.log('logged in succesfully')
                    setUserToken(conn, user, req, res).then(
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
                // return { statusCode: 500, location: '/500'}
                res.writeHead(303, { 'Location' : '/500'})
                res.end()
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

        let user = new User(null, encrypt(parsedBody.nameReg), encrypt(parsedBody.emailReg), encrypt(parsedBody.passReg))

        insertUser(conn, user).then(
            (result) => {
                console.log(result)
                res.writeHead(303, {'Location': '/registerSuccess'})
                res.end()
            },
            (error) => {
                console.log(error)
                res.writeHead(303, {'Location': '/500'})
                res.end()
            }
        )

        
    })
}

module.exports = {
    handleLoginReq,
    handleRegisterReq
}