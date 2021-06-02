
// Model pentru o linie din tabela "gamification_user_data".
class GamificationUserData {
    constructor(APIKey, userId, rewardId, progress) {
        this.APIKey = APIKey;
        this.userId = userId;
        this.rewardId = rewardId;
        this.progress = progress;
    }
}

module.exports = GamificationUserData;