const renderPage = require("../core/render");
const path = require("path");

const formRoute = (request, response) => {
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header_logged.hbs'),
        index: path.join(__dirname, '../../pages/form.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer_logged.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['form']
    }, (data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);

        return renderPage(paths.header, {
            userFullName: request.userFullName
        }, (data) => {
            response.write(data);

            return renderPage(paths.index, {
                successMessage: request.successMessage,
                errorMessage: request.errorMessage,
                gamificationSystemModel: request.gamificationSystemModel
            }, (data) => {
                response.write(data);

                return renderPage(paths.footer, {
                    client_js: ['form']
                }, (data) => {
                    response.write(data);

                    response.end();
                })
            })
        })
    })
}

module.exports = formRoute;