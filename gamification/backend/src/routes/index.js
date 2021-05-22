const renderPage = require("../core/render");
const path = require("path");

/**
 * Generates the index HTML page, based on index.hbs, head.hbs, header.hbs and footer.hbs.
 * @param {*} request The given request.
 * @param {*} response The response based on the given request.
 * @returns The rendered page.
 */
const indexRoute = (request, response) => {
    // TODO: <doctype html5> (to all pages)
    // TODO: <html lang="en"> (to all pages)
    // TODO: if user is logged in, use header_loggedin (to all pages)
    // TODO: validate html page (all pages)
    
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/index.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['index']
                                }, (data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);

        return renderPage(paths.header, null, (data) => {
            response.write(data);

            return renderPage(paths.index, null, (data) => {
                response.write(data);

                return renderPage(paths.footer, {
                    client_js: ['scrollNavbarAnimation']
                }, (data) => {
                    response.write(data);

                    response.end();
                })
            })
        })
    })
}

module.exports = indexRoute;