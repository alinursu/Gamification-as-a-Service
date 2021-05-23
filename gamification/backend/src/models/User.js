
// Model for a line in the "users" table.
class User {
    constructor(id, email, password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}

module.exports = User;