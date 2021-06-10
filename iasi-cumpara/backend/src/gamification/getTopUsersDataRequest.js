const axios = require("axios");
const {gamification} = require("../../config");

const getTopUsersDataRequest = async () => {
    try {
        const response = await axios.get('http://localhost:8081/external/gamification-system/top-users?apikey=' + gamification.apiKey)
        return response.data
    } catch (error) {
        // console.log(error)
        return null;
    }

}

module.exports = getTopUsersDataRequest