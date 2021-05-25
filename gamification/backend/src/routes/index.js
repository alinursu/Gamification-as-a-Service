const renderPage = require("../core/render");

const path = require("path");
var cookie = require('cookie');

/**
 * Genereaza pagina HTML index, folosind fisierele index.hbs, head.hbs, header.hbs si footer.hbs.
 * @param {*} request Request-ul primit
 * @param {*} response Raspunsul dat pentru request.
 */
const indexRoute = (request, response) => {
    // TODO: <doctype html5> (to all pages)
    // TODO: <html lang="en"> (to all pages)
    // TODO: validate html page (all pages)

    var cookies = cookie.parse(request.headers.cookie || '');
    
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: ((cookies.authToken == null) ? path.join(__dirname, '../../pages/common/header.hbs') : path.join(__dirname, '../../pages/common/header_logged.hbs')),
        index: path.join(__dirname, '../../pages/index.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['index']
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
                errorMessage: request.errorMessage,
                successMessage: request.successMessage,
                previousNameValue: request.previousNameValue,
                previousEmailValue: request.previousEmailValue,
                previousTextValue: request.previousTextValue
            }, (data) => {
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