const path = require('path')
const staticServe = require('node-static')
const home = require('../routes/home')
const profile = require('../routes/profile')
const login = require('../routes/login')
const category = require('../routes/category')
const { handleLoginReq, handleRegisterReq } = require('../controllers/loginController')

const file = new (staticServe.Server)(path.join(__dirname,'../../pages/'), { cache: 1})

const routing = (req,res) => {
    const url = req.url

    // GET Requests
    if(req.method === 'GET') {
        switch (url) {
            case '/':
                return home(req, res);
            case '/profile':
                return profile(req, res);
            case '/category/cars':
                req.category = 'cars';
                return category(req, res);
            case '/login':
                return login(req, res);
        }
    }

    // dynamic routes
    if (url.toString().substr(0, 8) === '/styles/') {
        return file.serve(req,res)
    }
    if (url.toString().substr(0, 4) === '/js/') {
        return file.serve(req,res)
    }
    if(url.toString().substr(0, 8) === '/assets/') {
        return file.serve(req,res)
    }

    //POST Requests
    if(req.method === 'POST') {
        console.log(url)
        switch(url) {
            case '/login': {
                return handleLoginReq(req, res)
            }

            case '/register': {
                return handleRegisterReq(req, res)
            }
        }
    }

    res.write('<h1>404<h1>') //write a respoonse
    res.end()
}

module.exports = routing