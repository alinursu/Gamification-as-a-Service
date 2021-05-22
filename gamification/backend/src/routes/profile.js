const renderPage = require("../core/render");
const path = require("path");

/**
 * Generates the register HTML page, based on profile.hbs, head.hbs, header.hbs and footer.hbs.
 * @param {*} request The given request.
 * @param {*} response The response based on the given request.
 * @returns The rendered page.
 */
const profileRoute = (request, response) => {
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/profile.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['profile']
    }, (data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);

        return renderPage(paths.header, null, (data) => {
            response.write(data);

            return renderPage(paths.index, null, (data) => {
                response.write(data);

                return renderPage(paths.footer, {
                    client_js: ['profilePageMenu']
                }, (data) => {
                    response.write(data);
                    
                    response.end();
                })
            })
        })
    })
}

module.exports = profileRoute;