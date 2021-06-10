const postDataRequest = require("../gamification/postDataRequest");
const getDataRequest = require("../gamification/getDataRequest");
const getTopUsersDataRequest = require("../gamification/getTopUsersDataRequest");

const GamificationController = class {
    constructor(userId) {
        this.userId = userId;
    }

    // eveniment adaugare comment
    commentAdded() {
        return postDataRequest(this.userId, "comentariu-adăugat");
    }

    // eveniment register
    registered() {
        return postDataRequest(this.userId, "cont-creat");
    }

    //afisare rewards in pagina de profil
    getRewards() {
        return getDataRequest(this.userId);
    }

    // afisare top in index
    getTop() {
        return getTopUsersDataRequest();
    }

    //eveniment produs cumparat
    buyProduct(){
        return postDataRequest(this.userId,"produs-cumpărat");
    }
}

module.exports = GamificationController;