const render = require('../core/render')
const path = require('path')

const login = async (req, res) => {
    const styles = ['auth/login', 'auth/mobile']

    const scripts = ['auth/login']

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/login.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    try {
        const head = await render(paths.head, {title: 'IaȘi Cumpără', styles: styles});
        const header = await render(paths.header, null);
        const index = await render(paths.index, {
            errorMessage: req.errorMessage
        });
        const footer = await render(paths.footer, {scripts: scripts});
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(head + header + index + footer);
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.end();
    }
}

module.exports = login;