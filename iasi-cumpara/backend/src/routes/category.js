const render = require("../core/render")
const path = require("path");
const ProductController = require("../controllers/productController");
const con = require("../database/connectionDb");


const category = async (req, res) => {
    const styles = ['products/searchresult']
    let items = [];

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/category.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    try{
        const productController = new ProductController(con);
        items = await productController.getAllByCategory(req.category);
    } catch (error) {
        console.log(error);
        res.writeHead(500);
        return res.end();
    }

    // parse images
    items = items.map(item => ({
        ...item,
        image: JSON.parse(item.images)[0]
    }))

    try {
        const head = await render(paths.head, {title: 'IaȘi Cumpără', styles: styles});
        const header = await render(paths.header, null);
        const index = await render(paths.index, {items: items, title: req.title, total: items.length});
        const footer = await render(paths.footer, null);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(head + header + index + footer);
        res.end();
    } catch (error) {
        console.log(error)
        res.writeHead(500);
        res.end();
    }
}

module.exports = category;