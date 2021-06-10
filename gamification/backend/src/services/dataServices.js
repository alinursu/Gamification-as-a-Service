const { getDatabaseConnection } = require('../internal/databaseConnection');

const UserModel = require('../models/User');
const GamificationSystemModel = require('../models/GamificationSystem');
const GamificationEventModel = require('../models/GamificationEvent');
const GamificationRewardModel = require('../models/GamificationReward');
const ContactMessageModel = require('../models/ContactMessage');

const utils = require("../internal/utils");

const UsersRepository = require("../repositories/usersRepository");
const GamificationSystemsRepository = require("../repositories/gamificationSystemsRepository");
const ContactMessagesRepository = require("../repositories/contactMessagesRepository");

/**
 * Adauga in baza de date utilizatorii importati dintr-un fisier CSV.
 * @param lines Continutul fisierului CSV.
 * @returns 0, daca utilizatorii au fost adaugati cu succes; 1, daca o linie contine prea multe/prea putine date; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addImportedUsers(lines) {
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;

    connectionPool.getConnection(async function (error, connection) {
        // Verific si adaug datele din fisierul CSV
        for(let i=1; i<lines.length; i++) {
            let line = lines[i].split(',');
            if(line.length !== 6) {
                connection.rollback();
                connection.release();
                returnedValue = 1;
                return;
            }

            let userModel = new UserModel(null, line[0], line[1], line[2], line[3], line[4], line[5]);

            var dbResult = null;
            await UsersRepository.insertUserModel(userModel, connection).then(function (result) {
                dbResult = result;
            })

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return;
            }
        }

        connection.commit();
        connection.release();
        returnedValue = 0;
    });

    while(returnedValue == null) {
        await utils.timeout(10);
    }

    return returnedValue;
}

/**
 * Adauga in baza de date sistemele de gamificare importate dintr-un fisier CSV.
 * @param lines Continutul fisierului CSV.
 * @returns 0, daca sistemele au fost adaugate cu succes; 1, daca o linie contine prea multe/prea putine date;
 * 2, daca cheia API este deja folosita (primary key violation); -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addImportedGamificationSystems(lines) {
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;

    connectionPool.getConnection(async function (error, connection) {
        // Verific si adaug datele din fisierul CSV
        for(let i=1; i<lines.length; i++) {
            let line = lines[i].split(',');
            if(line.length !== 3) {
                connection.rollback();
                connection.release();
                returnedValue = 1;
                return;
            }

            let gamificationSystemModel = new GamificationSystemModel(line[0], line[1], line[2], null, null);

            var dbResult = null;
            await GamificationSystemsRepository.addGamificationSystemToDatabase(gamificationSystemModel, connection).then(function (result) {
                dbResult = result;
            })

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return;
            }

            if(dbResult === 1) {
                connection.rollback();
                connection.release();
                returnedValue = 2;
                return;
            }
        }

        connection.commit();
        connection.release();
        returnedValue = 0;
    });

    while(returnedValue == null) {
        await utils.timeout(10);
    }

    return returnedValue;
}

/**
 * Adauga in baza de date evenimente pentru niste sisteme de gamificare importate dintr-un fisier CSV.
 * @param lines Continutul fisierului CSV.
 * @returns 0, daca sistemele au fost adaugate cu succes; 1, daca o linie contine prea multe/prea putine date; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addImportedGamificationEvents(lines) {
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;

    connectionPool.getConnection(async function (error, connection) {
        // Verific si adaug datele din fisierul CSV
        for(let i=1; i<lines.length; i++) {
            let line = lines[i].split(',');
            if(line.length !== 3) {
                connection.rollback();
                connection.release();
                returnedValue = 1;
                return;
            }

            let gamificationEventModel = new GamificationEventModel(null, line[0], line[1], line[2] );

            var dbResult = null;
            await GamificationSystemsRepository.addGamificationEventToDatabase(gamificationEventModel, connection).then(function (result) {
                dbResult = result;
            })

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return;
            }
        }

        connection.commit();
        connection.release();
        returnedValue = 0;
    });

    while(returnedValue == null) {
        await utils.timeout(10);
    }

    return returnedValue;
}

/**
 * Adauga in baza de date recompense pentru niste sisteme de gamificare importate dintr-un fisier CSV.
 * @param lines Continutul fisierului CSV.
 * @returns 0, daca recompensele au fost adaugate cu succes; 1, daca o linie contine prea multe/prea putine date; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addImportedGamificationRewards(lines) {
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;

    connectionPool.getConnection(async function (error, connection) {
        // Verific si adaug datele din fisierul CSV
        for(let i=1; i<lines.length; i++) {
            let line = lines[i].split(',');
            if(line.length !== 6) {
                connection.rollback();
                connection.release();
                returnedValue = 1;
                return;
            }

            let gamificationRewardModel = new GamificationRewardModel(null, line[0], line[1], line[2], line[3], line[4], line[5]);

            var dbResult = null;
            await GamificationSystemsRepository.addGamificationRewardToDatabase(gamificationRewardModel, connection).then(function (result) {
                dbResult = result;
            })

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return;
            }
        }

        connection.commit();
        connection.release();
        returnedValue = 0;
    });

    while(returnedValue == null) {
        await utils.timeout(10);
    }

    return returnedValue;
}

/**
 * Adauga in baza de date mesajele de contact importate dintr-un fisier CSV.
 * @param lines Continutul fisierului CSV.
 * @returns 0, daca mesajele au fost adaugate cu succes; 1, daca o linie contine prea multe/prea putine date; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function addImportedContactMessages(lines) {
    var connectionPool = getDatabaseConnection();
    var returnedValue = null;

    connectionPool.getConnection(async function (error, connection) {
        // Verific si adaug datele din fisierul CSV
        for(let i=1; i<lines.length; i++) {
            let line = lines[i].split(',');
            if(line.length !== 3) {
                connection.rollback();
                connection.release();
                returnedValue = 1;
                return;
            }

            let contactMessageModel = new ContactMessageModel(null, line[0], line[1], line[2], line[3]);

            var dbResult = null;
            await ContactMessagesRepository.addContactMessageToDatabase(contactMessageModel, connection).then(function (result) {
                dbResult = result;
            })

            while(dbResult == null) {
                await utils.timeout(10);
            }

            if(dbResult === -1) {
                connection.rollback();
                connection.release();
                returnedValue = -1;
                return;
            }
        }

        connection.commit();
        connection.release();
        returnedValue = 0;
    });

    while(returnedValue == null) {
        await utils.timeout(10);
    }

    return returnedValue;
}

module.exports = {addImportedUsers, addImportedGamificationSystems, addImportedGamificationEvents,
    addImportedGamificationRewards, addImportedContactMessages};