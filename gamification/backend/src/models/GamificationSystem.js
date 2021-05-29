
// Model pentru o linie din tabela "gamification_systems".
class GamificationSystem {
    constructor(APIKey, name, userId, listOfGamificationEvents, listOfGamificationRewards) {
        this.APIKey = APIKey;
        this.name = name;
        this.userId = userId;
        this.listOfGamificationEvents = listOfGamificationEvents;
        this.listOfGamificationRewards = listOfGamificationRewards;
    }
}

module.exports = GamificationSystem;