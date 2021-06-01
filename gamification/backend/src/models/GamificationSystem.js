
// Model pentru o linie din tabela "gamification_systems".
class GamificationSystem {
    constructor(APIKey, name, userId, listOfGamificationEvents=null, listOfGamificationRewards=null) {
        this.APIKey = APIKey;
        this.name = name;
        this.userId = userId;
        this.listOfGamificationEvents = listOfGamificationEvents;
        this.listOfGamificationRewards = listOfGamificationRewards;
    }
}

module.exports = GamificationSystem;