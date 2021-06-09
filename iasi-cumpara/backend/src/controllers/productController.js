const {findProductsByName} = require("../database/tables/products");
const {findProductsByCategory} = require("../database/tables/products");
const {getProductById} = require("../database/tables/products");
const {insertProduct} = require("../database/tables/products");

const ProductController = class {
    constructor(conn) {
        this.conn = conn;
    }

    getProduct(id) {
        return getProductById(this.conn, id);
    }

    addProduct(product) {
        return insertProduct(this.conn, product);
    }

    searchByName(name){
        return findProductsByName(this.conn,name);
    }

    getAllByCategory(category) {
        return findProductsByCategory(this.conn, category)
    }
}

module.exports = ProductController;