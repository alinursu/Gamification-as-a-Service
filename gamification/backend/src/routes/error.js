const renderPage = require("../core/render");

const path = require("path");
var cookie = require('cookie');

/**
 * Genereaza pagina HTML pentru eroare, folosind fisierele error.hbs, head.hbs, header.hbs si footer.hbs.
 * @param {*} request Request-ul primit
 * @param {*} response Raspunsul dat pentru request.
 */
const errorRoute = (request, response) => {
    var cookies = cookie.parse(request.headers.cookie || '');
    
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: ((cookies.authToken == null) ? path.join(__dirname, '../../pages/common/header.hbs') : path.join(__dirname, '../../pages/common/header_logged.hbs')),
        index: path.join(__dirname, '../../pages/error.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['error']
    }, (data) => {
        var statusCode = response.statusCode;
        if(statusCode != null) {
            response.writeHead(statusCode, {'Content-Type': 'text/html'});
        }
        else {
            response.writeHead(200, {'Content-Type': 'text/html'});
        }
        response.write(data);

        // TODO: If cookies.loginToken is present(!= null), get info from database and display in page
        return renderPage(paths.header, null, (data) => {
            response.write(data);

            return renderPage(paths.index, {
                statusCode: response.statusCode,
                statusCodeMessage: request.statusCodeMessage,
                errorMessage: request.errorMessage
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

module.exports = errorRoute;