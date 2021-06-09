const path = require('path')
const staticServe = require('node-static')
const home = require('../routes/home')
const profile = require('../routes/profile')
const login = require('../routes/login')
const category = require('../routes/category')
const product = require("../routes/product");
const {handleLoginReq, handleRegisterReq} = require('../controllers/loginController')
const registerSuccess = require('../routes/success/registerSuccess')
const notFound = require('../routes/error/404')
const internalErr = require('../routes/error/500')

const file = new (staticServe.Server)(path.join(__dirname, '../../pages/'), {cache: 1})

const routing = (req, res) => {
    const url = req.url

    // GET Requests
    if (req.method === 'GET') {
        switch (url) {
            case '/':
                return home(req, res)
            case '/profile':
                return profile(req, res)
            case '/category/cars':
                req.category = 'cars';
                req.title = 'Automobile și ambarcațiuni';
                return category(req, res);
            case '/category/phones':
                req.category = 'phones';
                req.title = 'Telefoane și tablete'
                return category(req, res);
            case '/login':
                return login(req, res)
            case '/registerSuccess':
                return registerSuccess(req, res)
            case '/404':
                return notFound(req, res)
            case '/500':
                return internalErr(req,res)
        }
    }

    // dynamic route for search
    if(req.method === 'GET' && url.startsWith('/search')){
        return search(req, res);
    }

    // dyanmic route for product
    if(req.method === 'GET' && url.startsWith('/product/'))
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
        }
    }

    res.writeHead(404, { 'Location' : '/404'}) //write a respoonse
    res.end()
}

module.exports = routing