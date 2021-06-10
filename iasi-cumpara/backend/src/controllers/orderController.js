const Order = require('../models/order')
const conn = require('../database/connectionDb')
const {parse} = require('querystring')
const {encrypt} = require('../internal/hash')
const {getUserByToken} = require('../database/tables/users')
const {placeOrder} = require('../database/tables/orders')
let cookie = require('cookie')
const GamificationController = require("./gamificationController");
const success = require('../routes/success/success')

handleNewOrder = (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    let parsedBody
    req.on('end', async () => {
        console.log('BODY BOY: ', body)
        parsedBody = parse(body)
        let cookies = cookie.parse(req.headers.cookie || '')
        getUserByToken(conn, cookies.authTokenISC).then(
            async (result) => {

                // adauga realizare de cumparare
                const gamificationController = new GamificationController(result.id);
                await gamificationController.buyProduct()

                let date_ob = new Date()
                let day = ("0" + date_ob.getDate()).slice(-2)
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
                let year = date_ob.getFullYear()
                let currentDate = year + '-' + month + '-' + day
                let order = new Order(null, result.id, parsedBody.productId, parsedBody.quantity, currentDate)
                placeOrder(conn, order).then(
                    (result) => {
                        console.log(result)
                        req.successMessage = 'Felicitări! Ai achiziționat cu succes acest produs! Acum poți vedea comanda în lista de pe profilul tău'
                        req.successAction = 'Contul meu'
                        req.successRouteTo = '/profile'
                        success(req, res)
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