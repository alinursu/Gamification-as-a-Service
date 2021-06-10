const postDataRequest = require("../gamification/postDataRequest");
const getDataRequest = require("../gamification/getDataRequest");

const GamificationController = class {
    constructor(userId) {
        this.userId = userId;
    }

    // eveniment adaugare comment
    commentAdded() {
        return postDataRequest(this.userId, "event1upd1");
    }

    // eveniment register
    registered() {
        return postDataRequest(this.userId, "event1upd1");
    }

    getRewards() {
        return getDataRequest(this.userId);
    }
}

module.exports = GamificationController;