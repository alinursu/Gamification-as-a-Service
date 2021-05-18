const renderPage = require("../core/render");
const path = require("path");

/**
 * Generates the register HTML page, based on register.hbs, head.hbs, header.hbs and footer.hbs.
 * @param {*} request The given request.
 * @param {*} response The response based on the given request.
 * @returns The rendered page.
 */
const registerRoute = (request, response) => {
    const paths = {
        head: path.join(__dirname, '../../pages/head.hbs'),
        header: path.join(__dirname, '../../pages/header.hbs'),
        index: path.join(__dirname, '../../pages/register.hbs'),
        footer: path.join(__dirname, '../../pages/footer.hbs')
    }

    return renderPage(paths.head, {title: 'Gamification as a Service'}, (data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);

        return renderPage(paths.header, null, (data) => {
            response.write(data);

            return renderPage(paths.index, null, (data) => {
                response.write(data);

                return renderPage(paths.footer, null, (data) => {
                    response.write(data);
                    
                    response.end();
                })
            })
        })
    })
}

module.exports = registerRoute;