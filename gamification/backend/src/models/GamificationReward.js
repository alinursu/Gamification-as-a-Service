
// Model pentru o linie din tabela "gamification_rewards".
class GamificationReward {
    constructor(id, systemAPIKey, name, type, eventId, value) {
        this.id = id;
        this.systemAPIKey = systemAPIKey;
        this.name = name;
        this.type = type;
        this.eventId = eventId;
        this.value = value;
    }
}

module.exports = GamificationReward;