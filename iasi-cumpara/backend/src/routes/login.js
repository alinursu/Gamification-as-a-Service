const render = require('../core/render')
const path = require('path')

const login = (req,res) => {
    const styles = ['auth/login', 'auth/mobile']

    const scripts = ['auth/login']

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/login.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return render(paths.head, {
        title: 'IaȘi Vinde',
        styles: styles
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(data);

        return render(paths.header, null, (data) => {
            res.write(data);
            return render(paths.index, null, (data) => {
                res.write(data);
                return render(paths.footer, {scripts: scripts}, (data) => {
                    res.write(data);
                    res.end();
                })
            })
        })
    })
}

module.exports = login;