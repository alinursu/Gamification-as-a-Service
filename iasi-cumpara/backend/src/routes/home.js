const render = require("../core/render");
const path = require("path");

const home = (req, res) => {
    const paths = {
        head: path.join(__dirname, '../components/General/head.hbs'),
        index: path.join(__dirname, '../pages/index.hbs'),
        footer: path.join(__dirname, '../components/General/footer.hbs')
    }

    return render(paths.head, {
        title: 'IaȘi Vinde'
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(data);

        return render(paths.index, null, (data) => {
            res.write(data);
            return render(paths.footer, null, (data) => {
                res.write(data);
                res.end();
            })
        })
    })
}

module.exports = home;