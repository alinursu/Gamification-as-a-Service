const renderPage = require("../core/render");
const path = require("path");

const adminAddUserDataRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/addUserData.hbs')
    }
    return renderPage(paths.index, {styles: ['admin-add-user-data']}, (data) => {
            response.write(data);
            response.end();
        }
    );
}

module.exports = adminAddUserDataRoute;