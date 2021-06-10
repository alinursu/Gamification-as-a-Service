var cookie = require('cookie');
const render = require("../core/render");
const path = require("path");
const UserController = require("../controllers/userController");
const con = require("../database/connectionDb");
const GamificationController = require("../controllers/gamificationController");
const { getOrdersForUser } = require('../database/tables/orders');
const { getProductById } = require('../database/tables/products');

const profile = async (req, res) => {
    const styles = ['products/searchresult', 'profile/view-profile', 'profile/view-profile-mobile']


    let cookies = cookie.parse(req.headers.cookie || '');
    const userController = new UserController(con);
    let userModel = await userController.getUserByToken(cookies.authTokenISC);

    // incarca realizari
    const gamificationController = new GamificationController(userModel.id);
    const rewards = await gamificationController.getRewards();
    const orders = await getOrdersForUser(con, userModel.id)
    for(let order of orders) {
        order.product = await getProductById(con, order.productId)
        order.image = JSON.parse(order.product.images)[0]
        order.total = order.product.price * order.quantity
    }

    console.log(rewards);

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        profile: path.join(__dirname, '../../pages/views/profile.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    try {
        const head = await render(paths.head, {title: 'IaȘi Cumpără', styles: styles})
        const header = await render(paths.header, null);
        const profile = await render(paths.profile, {
            userModel : userModel,
            rewards: rewards,
            orders: orders
        });
        const footer = await render(paths.footer, null);
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(head + header + profile + footer);
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.end();
    }
}

module.exports = profile;