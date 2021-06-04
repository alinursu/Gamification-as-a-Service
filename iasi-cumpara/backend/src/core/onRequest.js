const routing = require('./routing')
const onRequest = (req, res) => {
    return routing(req, res)
}

module.exports = onRequest