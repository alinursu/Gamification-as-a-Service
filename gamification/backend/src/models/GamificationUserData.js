
// Model pentru o linie din tabela "gamification_user_data".
class GamificationUserData {
    constructor(APIKey, userId, rewardId, progress, firstIssuedAt) {
        this.APIKey = APIKey;
        this.userId = userId;
        this.rewardId = rewardId;
        this.progress = progress;
        this.firstIssuedAt = firstIssuedAt;
    }
}

module.exports = GamificationUserData;