const axios = require("axios");
const getTopUsersDataRequest = async () => {
    try {
        const apikey = 'xL2Pg7q%K1Z480hShSH74w8r@G6DPCg!B4edut%q6%o@Y7FvKAhQol0L@Ngj7@__'
        const response = await axios.get('http://localhost:8081/external/gamification-system/top-users?apikey=' + apikey)
        return response.data
    } catch (error) {
        // console.log(error)
        return null;
    }

}

module.exports = getTopUsersDataRequest