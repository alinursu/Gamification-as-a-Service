const axios = require("axios");
const {gamification} = require("../../config");

const getDataRequest = async (userId) => {
    try {
        const response = await axios.get('http://localhost:8081/external/gamification-system?apikey=' + gamification.apiKey + '&userId=' + userId)
        const data = response.data;

        if(data.status === "success") {
            return data.rewards;
        }

        return [];
    } catch (error) {
        console.log(error)
        return [];
    }
}

module.exports = getDataRequest;