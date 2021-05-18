const http = require('http');
const onRequest = require('./src/core/onRequest');

//create a server object:
http.createServer(onRequest).listen(3000, () => {
    console.log("server start at port 3000"); //the server object listens on port 3000
});