const errorRoute = require("../routes/error");

const UserController = require('../controllers/UserController');
const GamificationSystemController = require('../controllers/GamificationSystemController');
const GamificationSystemExternalController = require('../controllers/GamificationSystemExternalController');

const cookie = require('cookie');

/**
 * Face rutarea unui cereri de tip PUT.
 * @param request Cererea facuta.
 * @param response Raspunsul dat de server.
 */
async function route(request, response) {
    const url = request.url;
    let cookies = cookie.parse(request.headers.cookie || '');

    // Rutari dinamice PUT
    if (url.startsWith('/profile/change-url')) {
        if (cookies.authToken != null) {
            return UserController.handleChangeURLRequest(request, response);
        }

        // Utilizatorul este neautentificat - 403 Forbidden
        response.statusCode = 403;
        request.statusCodeMessage = "Forbidden";
        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    if (url.startsWith('/profile/modify-gamification-system')) {
        if (cookies.authToken != null) {
            return GamificationSystemController.handleModifyGamificationSystemRequest(request, response);
        }

        // Utilizatorul este neautentificat - 403 Forbidden
        response.statusCode = 403;
        request.statusCodeMessage = "Forbidden";
        request.errorMessage = "Nu ai dreptul de a accesa această pagină!";
        response.setHeader('Location', '/error');
        return errorRoute(request, response);
    }

    if (url.startsWith('/external/gamification-system')) {
        return GamificationSystemExternalController.handleExternalGamificationSystemPOSTPUTRequest(request, response);
    }

    // Nu poti face un request de tip PUT la pagina {{url}} - 403 Forbidden
    response.statusCode = 403;
    request.statusCodeMessage = "Forbidden";
    request.errorMessage = "Nu poți face un request de tip PUT la pagina \"" + url + "\"!";
    response.setHeader('Location', '/error');
    return errorRoute(request, response);
}

module.exports = {route};