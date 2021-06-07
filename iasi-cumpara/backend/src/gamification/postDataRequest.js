const axios = require("axios");
const postDataRequest = async () => {
    try {
        const apikey = 'xL2Pg7q%K1Z480hShSH74w8r@G6DPCg!B4edut%q6%o@Y7FvKAhQol0L@Ngj7@__'
        const response = await axios.post('http://localhost:8081/external/gamification_system?apikey=' + apikey, "userId=2&eventName=event1")
        console.log(response)
    } catch (error) {
        console.log(error.response.status)
    }

}

module.exports = postDataRequest