const renderPage = require("../core/render");
const path = require("path");

/**
 * Generates the index HTML page, based on index.hbs, head.hbs, header.hbs and footer.hbs.
 * @param {*} request The given request.
 * @param {*} response The response based on the given request.
 * @returns The rendered page.
 */
const indexRoute = (request, response) => {
    // TODO: <doctype html5>
    // TODO: pentru incarcarea css-usului in functie de pagina, sa am in head un {{other_styles}} si, in functie de pagina, imi inserez ce am nevoie
    //daca nu am nevoie, pun o linie goala
    
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