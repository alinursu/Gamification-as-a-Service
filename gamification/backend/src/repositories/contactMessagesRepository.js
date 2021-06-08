const { getDatabaseConnection } = require('../internal/databaseConnection');
const hash = require('../internal/hash');
const utils = require('../internal/utils');
const ContactMessageModel = require("../models/ContactMessage");

/**
 * Adauga un mesaj in baza de date.
 * @param {*} contactMessageModel Modelul mesajului care va fi adaugat in baza de date
 * @param {*} connection Conexiunea prin care se va executa instructiunea SQL (poate fi null).
 * @returns 1, daca mesajul a fost adaugat; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addContactMessageToDatabase(contactMessageModel, connection = null) {
    if(connection == null) {
        connection = getDatabaseConnection();
    }
    var sql = "INSERT INTO contact_messages(sender_name, sender_email, message) VALUES(?, ?, ?)";

    var queryResult = null;
    connection.query(sql, [hash.encrypt(contactMessageModel.name), hash.encrypt(contactMessageModel.email), 
              hash.encrypt(contactMessageModel.text)], function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = 1;
    })
    
    while(queryResult == null) {
        await utils.timeout(10);
    }

    return queryResult;
}

async function deleteContactById(id) {
    const connection = getDatabaseConnection();
    const sql = "DELETE FROM contact_messages WHERE id=?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

async function getGamificationContactById(id) {
    const connection = getDatabaseConnection();
    const sql = "SELECT * FROM contact_messages WHERE id=?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.length === 0)
                    resolve(null);
                else {
                    const contact = new ContactMessageModel(
                        result[0].id,
                        hash.decrypt(result[0].sender_name),
                        hash.decrypt(result[0].sender_email),
                        hash.decrypt(result[0].message)
                    );
                    resolve(contact);
                }
            }
        })
    });

}

async function updateContactById(contact) {
    const connection = getDatabaseConnection();
    const sql = "UPDATE contact_messages SET sender_name=?, sender_email=?, message=? WHERE id=?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [hash.encrypt(contact.name), hash.encrypt(contact.email), hash.encrypt(contact.text), contact.id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

/**
 * Preia din baza de date toate mesajele trimise pana acum.
 * @returns Lista modelelor ContactMessage din baza de date; -1, in cazul in care a aparut o eroare pe parcursul executiei.
 */
async function getAllMessages() {
    var connection = getDatabaseConnection();
    var sql = "SELECT * FROM contact_messages";

    var queryResult = null;
    connection.query(sql, function(error, results) {
        if(error) {
            queryResult = -1;
            return;
        }

        queryResult = results;
    })

    while(queryResult == null) {
        await utils.timeout(10);
    }

    queryResult.forEach(result => {
        result.sender_name = hash.decrypt(result.sender_name);
        result.sender_email = hash.decrypt(result.sender_email);
        result.message = hash.decrypt(result.message);
    });

    return queryResult;
}

module.exports = {
    addContactMessageToDatabase,
    getAllMessages,
    deleteContactById,
    getGamificationContactById,
    updateContactById
};