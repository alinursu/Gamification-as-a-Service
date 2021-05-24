
// Model pentru o linie din tabela "contact_messages".
class ContactMessage {
    constructor(id, name, email, text) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.text = text;
    }
}

module.exports = ContactMessage;