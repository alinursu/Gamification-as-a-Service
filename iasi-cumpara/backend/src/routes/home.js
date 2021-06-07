const render = require('../core/render')
const path = require('path')
const postDataRequest = require("../gamification/postDataRequest");

const home = (req,res) => {
    const styles = ['index/categories', 'index/achievements']

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/index.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    //test gamification api

    postDataRequest()

    return render(paths.head, {
        title: 'IaȘi Cumpără',
        styles: styles
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}) //http header
        res.write(data)

        return render(paths.header, null, (data) => {
            res.write(data)
            return render(paths.index, null, (data) => {
                res.write(data)
                return render(paths.footer, null, (data) => {
                    res.write(data)
                    res.end()
                })
            })
        })
    })
}

module.exports = home