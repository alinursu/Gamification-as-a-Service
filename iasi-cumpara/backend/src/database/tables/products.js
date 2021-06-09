const {encrypt} = require("../../internal/hash")

const selectAllProducts = (conn) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM products', (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
}

const getProductById = (conn, id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * from products where id = ?', id, (err, res) => {
            if (err) {
                reject(err)
            }

            resolve(res[0])
        })
    })
}

const findProductsByCategory = (conn, category) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * from products where category = ?', category, (err, res) => {
            if (err) {
                reject(err)
            }

            resolve(res)
        })
    })
}

const insertProduct = (conn, product) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO products SET ?', product, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}

// for seach
// const findProductsByName = (conn, name) => {
//     return new Promise((resolve, reject) => {
//         conn.query('SELECT * FROM products WHERE ?', name, (err) => {
//             if (err) {
//                 reject(err)
//             }
//             resolve()
//         })
//     })
// }

module.exports = {
    insertProduct,
    selectAllProducts,
    getProductById,
    findProductsByCategory,
    // findProductsByName
}