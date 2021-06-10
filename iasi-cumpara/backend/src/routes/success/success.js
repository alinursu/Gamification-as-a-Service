const render = require('../../core/render')
const path = require('path')

const success = (req,res) => {
    const paths = {
        head: path.join(__dirname, '../../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../../pages/common/header.hbs'),
        success: path.join(__dirname, '../../../pages/views/success/success.hbs'),
        footer: path.join(__dirname, '../../../pages/common/footer.hbs')
    }

    return render(paths.head, {
        title: 'IaȘi Cumpără'
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}) //http header
        res.write(data)

        return render(paths.header, null, (data) => {
            res.write(data)
            return render(paths.success, {
                successMessage: req.successMessage,
                successAction: req.successAction,
                successRouteTo: req.successRouteTo
            }, (data) => {
                res.write(data)
                return render(paths.footer, null, (data) => {
                    res.write(data)
                    res.end()
                })
            })
        })
    })
}

module.exports = success