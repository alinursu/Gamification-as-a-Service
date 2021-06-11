var http = require('http');
var requestHandler = require('./src/core/requestHandler')

http.createServer(requestHandler).listen(process.env.PORT || 8081, () => {
    console.log("Server-ul ruleaza pe port-ul 8081...");
});
