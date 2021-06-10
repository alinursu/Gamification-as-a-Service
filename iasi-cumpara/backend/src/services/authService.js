let cookie = require('cookie')


const generateAuthToken = () => {
    let tokenLength = 128
    let token = []
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$^*_+-=.,<>/?;|'

    for(let idx = 0; idx < tokenLength; idx++) {
        token.push(characters.charAt(Math.floor(Math.random() * characters.length)))
    }
    return token.join('')
}

const generateAuthCookie = (remember, req, res) => {
    let token = generateAuthToken()
    if(remember === 'on') {
        res.setHeader('Set-Cookie', cookie.serialize('authTokenISC', token, {
            maxAge: 60*60*24*365
        }))
    } else {
        res.setHeader('Set-Cookie', cookie.serialize('authTokenISC', token))
    }

    return token
}

module.exports = {
    generateAuthCookie
}