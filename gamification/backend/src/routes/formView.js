const renderPage = require("../core/render");
const path = require("path");

const formViewRoute = (request, response) => {
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header_logged.hbs'),
        index: path.join(__dirname, '../../pages/form_view.hbs'),
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
                gamificationSystemModel: request.gamificationSystemModel
            }, (data) => {
                response.write(data);

                return renderPage(paths.footer, null, (data) => {
                    response.write(data);

                    response.end();
                })
            })
        })
    })
}

module.exports = formViewRoute;