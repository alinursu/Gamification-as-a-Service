const render = require("../core/render");
const path = require("path");

const home = (req, res) => {
    return render(path.join(__dirname, '../pages/index.hbs'), {
        title: 'IaȘi Vinde'
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(data);
        res.end();
    })
}

module.exports = home;