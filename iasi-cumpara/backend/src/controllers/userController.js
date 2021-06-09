const {getUserByToken} = require("../database/tables/users");
const {getUserById} = require("../database/tables/users");


const UserController = class {
    constructor(conn) {
        this.conn = conn;
    }

    getUserById(id) {
        return getUserById(this.conn, id);
    }

    getUserByToken(token) {
        return getUserByToken(this.conn, token);
    }
}

module.exports = UserController;