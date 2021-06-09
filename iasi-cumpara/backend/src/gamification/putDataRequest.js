const axios = require("axios");
const postDataRequest = async (userId, eventName) => {
    try {
        const apikey = 'xL2Pg7q%K1Z480hShSH74w8r@G6DPCg!B4edut%q6%o@Y7FvKAhQol0L@Ngj7@__'
        const response = await axios.put('http://localhost:8081/external/gamification-system?apikey=' + apikey, {
            userId: userId,
            eventName: eventName
        })
        return response.data;
    } catch (error) {
        console.log(error.response.status)
        return null;
    }

}

module.exports = postDataRequest