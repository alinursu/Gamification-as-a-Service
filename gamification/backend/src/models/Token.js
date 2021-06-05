// Model pentru o linie din tabela "tokens".
class Token {
    constructor(token, userId, userFirstName, userLastName, expiresAt) {
        this.token = token;
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.expiresAt = expiresAt;
    }
}

module.exports = Token;