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

const generateAuthCookie = (req, res) => {
    let token = generateAuthToken()
    res.setHeader('Set-Cookie', cookie.serialize('authToken', token))

    return token
}

module.exports = {
    generateAuthCookie
}