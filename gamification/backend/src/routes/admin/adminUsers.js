const renderPage = require("../../core/render");
const path = require("path");
const usersRepository = require("../../repositories/UsersRepository");

const adminUsersListRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/users.hbs')
    }

    return renderPage(paths.index, {
        users: await usersRepository.getAllUsers(),
        styles: ['admin-users']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUsersListRoute;