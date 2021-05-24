
// Model pentru o linie din tabela "users".
class User {
    constructor(id, lastname, firstname, email, password, url) {
        this.id = id;
        this.lastname = lastname;
        this.firstname = firstname;
        this.email = email;
        this.password = password;
        this.url = url;
    }
}

module.exports = User;