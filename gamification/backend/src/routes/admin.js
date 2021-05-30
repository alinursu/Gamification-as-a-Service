const renderPage = require("../core/render");
const path = require("path");

const adminRoute = (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/panel.hbs'),

    }
    return renderPage(paths.index, null, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminRoute;