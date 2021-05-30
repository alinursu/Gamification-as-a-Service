const renderPage = require("../core/render");

const path = require("path");
var cookie = require('cookie');

/**
 * Genereaza pagina HTML pentru un profil, folosind fisierele profile.hbs, head.hbs, header.hbs si footer.hbs.
 * @param {*} request Request-ul primit
 * @param {*} response Raspunsul dat pentru request.
 */
const profileRoute = (request, response) => {
    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header_logged.hbs'),
        index: path.join(__dirname, '../../pages/profile.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer_logged.hbs')
    }

    return renderPage(paths.head, {
        title: 'Gamification as a Service',
        styles: ['profile']
    }, (data) => {
        var statusCode = response.statusCode;
        if(statusCode != null) {
            response.writeHead(statusCode, {'Content-Type': 'text/html'});
        }
        else {
            response.writeHead(200, {'Content-Type': 'text/html'});
        }
        response.write(data);

        return renderPage(paths.header, {
            userFullName: request.userFullName
        }, (data) => {
            response.write(data);

            return renderPage(paths.index, {
                errorMessage: request.errorMessage,
                successMessage: request.successMessage,
                previousURLValue: request.previousURLValue,
                userFullName: request.userFullName,
                userURL: request.userURL,
                listOfGamificationSystemModels: request.listOfGamificationSystemModels
            }, (data) => {
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