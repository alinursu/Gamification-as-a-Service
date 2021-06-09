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
    let comments;

    try {
        product = await productController.getProduct(productId)
        comments = await productController.getAllCommentsByProductId(productId)

        // Ordonez comentariile dupa data
        comments.sort(function compare(comment1, comment2) {
           let date1 = new Date(comment1.date);
           let date2 = new Date(comment2.date);

           if(date1 < date2) return 1;
           else if(date1 > date2) return -1;
           return 0;
        });

        // Formatez data fiecarui comentariu
        comments.forEach(comment => {
            var temp = new Date(comment.date);
            comment.date = (temp.getHours() < 10 ? "0" + temp.getHours() : temp.getHours()) + ":" +
                (temp.getMinutes() < 10 ? "0" + temp.getMinutes() : temp.getMinutes()) + " " +
                (temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate()) + "." +
                (temp.getMonth() < 10 ? "0" + temp.getMonth() : temp.getMonth()) + "." +
                temp.getFullYear();
        })
    } catch (error) {
        console.log(error);
    }

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
            images: JSON.parse(product.images),
            errorMessage: req.errorMessage,
            comments: comments
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
