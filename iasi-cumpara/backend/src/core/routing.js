const path = require('path')
const staticServe = require('node-static')
const home = require('../routes/home')
const profile = require('../routes/profile')
const login = require('../routes/login')
const category = require('../routes/category')
const product = require("../routes/product");
const { parse } = require('querystring')
const search = require("../routes/search");
const {handleLoginReq, handleRegisterReq} = require('../controllers/loginController')
const ProductController = require('../controllers/productController');
const conn = require("../database/connectionDb");

const ProductComment = require('../models/ProductComment')

const file = new (staticServe.Server)(path.join(__dirname, '../../pages/'), {cache: 1})

const routing = (req, res) => {
    const url = req.url

    // GET Requests
    if (req.method === 'GET') {
        switch (url) {
            case '/':
                return home(req, res);
            case '/profile':
                return profile(req, res);
            case '/category/cars':
                req.category = 'cars';
                req.title = 'Automobile și ambarcațiuni';
                return category(req, res);
            case '/category/phones':
                req.category = 'phones';
                req.title = 'Telefoane și tablete'
                return category(req, res);
            case '/category/laptops':
                req.category = 'laptops';
                req.title = 'Laptopuri și calculatoare'
                return category(req, res);
            case '/category/rents':
                req.category = 'rents';
                req.title = 'Închirieri și vânzări apartamente'
                return category(req,res);
            case '/category/furniture':
                req.category = 'furniture';
                req.title = 'Mobilier și electrocasnice';
                return category(req,res);
            case '/category/others':
                req.category ='others';
                req.title = 'Ate tipuri de produse';
                return category(req,res);
            case '/login':
                return login(req, res);
        }

    }

    // dynamic route for search
    if (req.method === 'GET' && url.startsWith('/search')) {
        return search(req, res);
    }

    // dyanmic route for product
    if (req.method === 'GET' && url.startsWith('/product/'))
        return product(req, res);

    // dynamic routes
    if (url.toString().substr(0, 8) === '/styles/') {
        return file.serve(req, res)
    }
    if (url.toString().substr(0, 4) === '/js/') {
        return file.serve(req, res)
    }
    if (url.toString().substr(0, 8) === '/assets/') {
        return file.serve(req, res)
    }

    //POST Requests
    if (req.method === 'POST') {
        console.log(url)
        switch (url) {
            case '/login': {
                return handleLoginReq(req, res)
            }

            case '/register': {
                return handleRegisterReq(req, res)
            }

            default: {
                if(url.startsWith('/product/') && url.includes('/add-comment')) {
                    // TODO: Verifica daca utilizatorul este autentificat
                    let body = ''
                    req.on('data', (chunk) => {
                        body += chunk.toString()
                    })

                    let parsedBody
                    req.on('end', async () => {
                        parsedBody = parse(body)

                        if(parsedBody.comment == null || parsedBody.comment.length === 0) {
                            req.errorMessage = "Câmpul comentariului nu poate să fie gol!"
                            return product(req, res)
                        }

                        let productComment = new ProductComment(
                            null, url.split('/product/')[1].split('/')[0],5,
                            parsedBody.comment, new Date(Date.now())
                        );

                        let productController = new ProductController(conn);
                        await productController.addProductComment(productComment);
                        return product(req, res)
                    });
                }
                return;
            }
        }
    }

    res.write('<h1>404<h1>') //write a respoonse
    res.end()
}

module.exports = routing