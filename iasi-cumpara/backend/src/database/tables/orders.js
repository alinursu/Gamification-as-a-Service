const {decrypt} = require("../../internal/hash");
const { encrypt } = require("../../internal/hash")
const Order = require('../../models/order')

const placeOrder = (conn, order, req, res) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO orders SET ?', order, (err) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}


module.exports = {
    placeOrder
}