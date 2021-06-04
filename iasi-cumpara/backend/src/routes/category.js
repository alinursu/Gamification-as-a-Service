const render = require("../core/render")
const path = require("path");


const category = (req, res) => {
    const styles = ['products/searchresult']

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/category.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    const cars = [{},{},{},{},{},{},{},{},{},{}]
    return render(paths.head, {
        title: 'IaȘi Cumpără',
        styles: styles
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(data);

        return render(paths.header, null, (data) => {
            res.write(data);
            return render(paths.index, {cars:cars}, (data) => {
                res.write(data);
                return render(paths.footer, null, (data) => {
                    res.write(data);
                    res.end();
                })
            })
        })
    })
}

module.exports = category;