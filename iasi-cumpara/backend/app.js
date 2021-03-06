const http = require('http')
const onRequest = require('./src/core/onRequest')
const con = require('./src/database/connectionDb')
const crypto = require('crypto')
const { insertUser } = require('./src/database/tables/users')
const { selectAllUsers } = require('./src/database/tables/users')

const connectToDbPromise = () => new Promise((resolve,reject) => {
    con.connect((err) => {
        if(err) {
            reject(err)
        }
        resolve()
    })
})

const startServer = async () => {
    try {
        await connectToDbPromise()
    } catch (error) {
        console.log('DB Connect Error: ' + error)
    }

    try {
        const users = await selectAllUsers(con)
    } catch (error) {
        console.log(`DB Query Error: ${error}`)
    }

    http.createServer(onRequest).listen(process.env.PORT || 8082, () => {
        console.log('Server started at port 8082') //the server object listens on port 8082
    })
}

startServer()