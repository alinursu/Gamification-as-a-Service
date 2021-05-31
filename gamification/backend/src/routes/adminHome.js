const renderPage = require("../core/render");
const path = require("path");

const adminHomeRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/adminHome.hbs')
    }

    return renderPage(paths.index, {
        styles: ['admin-home']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminHomeRoute;