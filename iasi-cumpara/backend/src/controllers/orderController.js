const Order = require('../models/order')
const conn = require('../database/connectionDb')
const { parse } = require('querystring')
const { encrypt } = require('../internal/hash')
const { getUserByToken } = require('../database/tables/users')
const { placeOrder } = require('../database/tables/orders')
let cookie = require('cookie')
handleNewOrder = (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    let parsedBody
    req.on('end', async () =>{
        parsedBody = JSON.parse(body)
        console.log('BODY: ', body)
        console.log('PARSEDBODY: ', parsedBody)
        console.log('PARSEDBODYTOKEN: ', parsedBody.token)
        let cookies = cookie.parse(req.headers.cookie || '')
        getUserByToken(conn, cookies.authTokenISC).then(
            (result) => {
                console.log(result.id)
                let date_ob = new Date()
                let day = ("0" + date_ob.getDate()).slice(-2)
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
                let year = date_ob.getFullYear()
                let currentDate = year + '-' + month + '-' + day
                let order = new Order(null, result.id, parsedBody.productId, parsedBody.quantity, currentDate)
                console.log(order)
                placeOrder(conn, order).then(
                    (result) => {
                        console.log(result)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (error) => {
                console.log(error)
            }
        )
    })
}

module.exports = {
    handleNewOrder
}