const render = require('../core/render')
const path = require('path')
const postDataRequest = require("../gamification/postDataRequest");

const home = async (req, res) => {
    const styles = ['index/categories', 'index/achievements']

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/index.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    //test gamification api
    // postDataRequest()

    try {
        const head = await render(paths.head, {title: 'IaȘi Cumpără', styles: styles});
        const header = await render(paths.header, null);
        const index = await render(paths.index, null);
        const footer = await render(paths.footer, null);
        res.writeHead(200, {'Content-Type': 'text/html'}) //http header
        res.write(head + header + index + footer);
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.end();
    }
}

module.exports = home