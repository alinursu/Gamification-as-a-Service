const render = require('../core/render')
const path = require('path')
const UserController = require("../controllers/userController");
const con = require("../database/connectionDb");
const GamificationController = require("../controllers/gamificationController");

const home = async (req, res) => {
    const styles = ['index/categories', 'index/achievements']

    const gamificationController = new GamificationController(con);
    let topUsersJSON = await gamificationController.getTop();

    let topUserScoreMap = [];
    if(topUsersJSON != null && topUsersJSON["status"] === "success") {
        const userController = new UserController(con);

        let index = 1;
        for(const topInfo of topUsersJSON.top) {
            if(index > 10) break;
            let userModel = await userController.getUserById(topInfo.userId);
            if(userModel != null) {
                topUserScoreMap.push(new Object ({
                    index : index,
                    user : userModel.name,
                    score : Math.abs(topInfo.score)
                }))
                index++;
            }
        }

        console.log(topUserScoreMap);
    }

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/views/index.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    //test gamification api
    // postDataRequest()

    try {
        const head = await render(paths.head, {title: 'IaȘi Cumpără', styles: styles});
        const header = await render(paths.header, null);
        const index = await render(paths.index, {
            topUsers : (topUsersJSON != null ? (topUsersJSON["status"] === "success" ? topUserScoreMap : null) : null )
        });
        const footer = await render(paths.footer, null);
        res.writeHead(200, {'Content-Type': 'text/html'}) //http header
        res.write(head + header + index + footer);
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(500);
        res.end();
    }
}

module.exports = home