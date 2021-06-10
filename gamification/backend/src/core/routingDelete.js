const errorRoute = require("../routes/error");

const GamificationSystemController = require('../controllers/gamificationSystemController');
const GamificationSystemExternalController = require('../controllers/gamificationSystemExternalController');

const cookie = require('cookie');

/**
 * Face rutarea unui cereri de tip DELETE.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function route(request, response) {
    const url = request.url;
    let cookies = cookie.parse(request.headers.cookie || '');

    // Rutari dinamice DELETE
    if (url.startsWith('/profile/delete-gamification-system')) {
        if (cookies.authToken != null) {
            return GamificationSystemController.handleDeleteGamificationSystemRequest(request, response);
        }

        // Utilizatorul este neautentificat - 403 Forbidden
        response.statusCode = 403;
        request.statusCodeMessage = "Forbidden";
        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    if (url.startsWith('/external/gamification-system')) {
        return GamificationSystemExternalController.handleExternalGamificationSystemDELETERequest(request, response);
    }

    // Nu poti face un request de tip DELETE la pagina {{url}} - 403 Forbidden
    response.statusCode = 403;
    request.statusCodeMessage = "Forbidden";
    request.errorMessage = "Nu poți face un request de tip DELETE la pagina \"" + url + "\"!";
    response.setHeader('Location', '/error');
    return errorRoute(request, response);
}

module.exports = {route};