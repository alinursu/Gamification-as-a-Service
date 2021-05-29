
// Model pentru o linie din tabela "gamification_events".
class GamificationEvent {
    constructor(id, systemAPIKey, name, eventType) {
        this.id = id;
        this.systemAPIKey = systemAPIKey;
        this.name = name;
        this.eventType = eventType;
    }
}

module.exports = GamificationEvent;