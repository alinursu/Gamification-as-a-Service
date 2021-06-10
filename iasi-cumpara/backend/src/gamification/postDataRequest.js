const axios = require("axios");
const {gamification} = require("../../config");

const postDataRequest = async (userId, eventName) => {
    try {
        const response = await axios.post(
            'http://localhost:8081/external/gamification-system?apikey=' + gamification.apiKey,
            `userId=${userId}&eventName=${eventName}`,
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
        return response.data;
    } catch (error) {
        console.log(error.response.data)
        return null;
    }

}

module.exports = postDataRequest