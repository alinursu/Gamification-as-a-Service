const renderPage = require("../core/render");
const path = require("path");
const querystringParser = require("querystring");
const usersRepository = require("../repositories/UsersRepository");

const adminUpdateUserRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/updateUser.hbs')
    }

    const queryString = request.url.split('?')[1];
    const queryObject = querystringParser.parse(queryString);

    try {
        if (!queryObject.id) {
            request.user = null;
        } else {
            request.user = await usersRepository.getUserModelById(queryObject.id);
        }
    } catch (error) {
        console.log(error);
        request.user = null;
    }

    return renderPage(paths.index, {user: request.user, styles: ['admin-update']}, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUpdateUserRoute;