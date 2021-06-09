const render = require('../../core/render')
const path = require('path')

const internalErr = (req,res) => {
    const paths = {
        head: path.join(__dirname, '../../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../../pages/common/header.hbs'),
        internErr: path.join(__dirname, '../../../pages/views/error/500.hbs'),
        footer: path.join(__dirname, '../../../pages/common/footer.hbs')
    }

    return render(paths.head, {
        title: 'IaȘi Cumpără'
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}) //http header
        res.write(data)

        return render(paths.header, null, (data) => {
            res.write(data)
            return render(paths.internErr, null, (data) => {
                res.write(data)
                return render(paths.footer, null, (data) => {
                    res.write(data)
                    res.end()
                })
            })
        })
    })
}

module.exports = internalErr