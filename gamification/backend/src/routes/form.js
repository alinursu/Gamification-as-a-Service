const renderPage = require("../core/render");
const path = require("path");

const formRoute = (request, response) => {
    // TODO: <doctype html5>
    // TODO: pentru incarcarea css-usului in functie de pagina, sa am in head un {{other_styles}} si, in functie de pagina, imi inserez ce am nevoie
    //daca nu am nevoie, pun o linie goala

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        index: path.join(__dirname, '../../pages/form.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['form']
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

module.exports = formRoute;