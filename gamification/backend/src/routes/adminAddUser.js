const renderPage = require("../core/render");
const path = require("path");

const adminAddUserRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/addUser.hbs')
    }
    return renderPage(paths.index, {styles: ['admin-add']}, (data) => {
            response.write(data);
            response.end();
        }
    );
}

module.exports = adminAddUserRoute;