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

const insertProductComment = (conn, productComment) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO product_comments(product_id, user_id, comment, date) VALUES (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i'))", [
                    productComment.productId,
                    productComment.userId,
                    productComment.comment,
                    productComment.date.getFullYear() + "-" + productComment.date.getMonth() + "-" + productComment.date.getDate() +
                        " " + productComment.date.getHours() + ":" + productComment.date.getMinutes()
                ], (err) => {
            if (err) {
                console.log(err);
            }
            resolve();
        });
    });
}

//for seach
const findProductsByName = (conn, name) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM products WHERE name LIKE ?', ['%' + name + '%'], (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

const getProductCommentsByProductId = (conn, productId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * from product_comments where product_id = ?', productId, (err, res) => {
            if (err) {
                reject(err)
            }

            resolve(res)
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
    insertProductComment,
    getProductCommentsByProductId,
    findProductsByName
}