const render = require("../core/render");
const path = require("path");
const ProductController = require("../controllers/productController");
const con = require("../database/connectionDb");
const Product = require("../models/product");

const product = async (req, res) => {

    const styles = ['products/product']
    const scripts = ['products/product']

    const urlArray = req.url.split('/');
    const productId = urlArray[2];
    const productController = new ProductController(con);
    let product;

    try {
        product = await productController.getProduct(productId)
    } catch (error) {
        console.log(error);
    }

    console.log(product)

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        product: path.join(__dirname, '../../pages/views/product.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    try {
        const head = await render(paths.head, {title: 'IaȘi Cumpără', styles: styles})
        const header = await render(paths.header, null);
        const productHBS = await render(paths.product, {
            product: product,
            images: JSON.parse(product.images)
        });
        const footer = await render(paths.footer, {scripts: scripts});
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(head + header + productHBS + footer);
        res.end();

    } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.end();
    }
}
module.exports = product;
