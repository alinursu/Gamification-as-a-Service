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

const getOrdersForUser = (conn, id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM orders WHERE userId = ?', id, (err, rows) => {
            if(err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

module.exports = {
    placeOrder,
    getOrdersForUser
}