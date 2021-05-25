const http = require('http');
const onRequest = require('./src/core/onRequest');
const con = require('./src/database/connectionDb');
const crypto = require('crypto');
const {insertUser} = require("./src/database/tables/users");
const {selectAllUsers} = require("./src/database/tables/users");

const connectToDbPromise = () => new Promise((resolve, reject) => {
    con.connect((err) => {
        if (err)
            reject(err);

        resolve();
    });
})

const startServer = async () => {
    try{
        await connectToDbPromise();
    } catch(error){
        console.log("DB Connect Error: " + error);
    }

    // try{
    //     await insertUser(con,"alin", "alin@test.com", "pass_alin");
    // } catch (error) {
    //     console.log("DB Insert Error:" + error);
    // }

    try {
        const users = await selectAllUsers(con);
        console.log(users);
    } catch (error) {
        console.log(`DB Query Error: ${error}`);
    }



    http.createServer(onRequest).listen(3000, () => {
        console.log("server start at port 3000"); //the server object listens on port 3000
    });
}

startServer();





