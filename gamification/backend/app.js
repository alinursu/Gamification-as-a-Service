var http = require('http');
var requestHandler = require('./src/core/requestHandler')

http.createServer(requestHandler).listen(8081, () => {
    console.log("Server is running on port 8081...");
});