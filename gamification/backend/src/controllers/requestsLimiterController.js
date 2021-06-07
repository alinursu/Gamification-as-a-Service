const errorRoute = require("../routes/error");

const utils = require("../internal/utils");

const { RateLimiterMemory } = require('rate-limiter-flexible');

const loginRequestsLimiter = new RateLimiterMemory ({
    points: 10, // 10 request-uri permise
    duration: 600, // 10 minute
});

const registerRequestsLimiter = new RateLimiterMemory ({
    points: 10, // 10 request-uri permise
    duration: 600, // 10 minute
});

/**
 * Contorizeaza numarul de request-uri de tip POST pentru pagina /login.
 * @param {*} request Cererea facuta de client
 * @param {*} response Raspunsul dat de server.
 * @param {*} callback Functia care va fi apelata daca nu s-a depasit numarul de request-uri.
 */
const loginRequestsLimiterFunction = async (request, response, callback) => {
    loginRequestsLimiter.consume(request.ip).then(async () => {
        response.statusCode = 0;
        var callbackResponse = callback(request, response);

        while(response.statusCode === 0) {
            await utils.timeout(10);
        }

        if(response.statusCode === 307) {
            loginRequestsLimiter.delete(request.ip);
        }
        return callbackResponse;
    })
    .catch((exception) => {
        response.statusCode = 429; // 429 - Too Many Requests
        request.statusCodeMessage = "Too Many Requests";
        request.errorMessage = "Ai încercat să te autentifici de prea multe ori! Încearcă din nou peste 10 minute.";
        return errorRoute(request, response);
    });
};

/**
 * Contorizeaza numarul de request-uri de tip POST pentru pagina /register.
 * @param {*} request Cererea facuta de client
 * @param {*} response Raspunsul dat de server.
 * @param {*} callback Functia care va fi apelata daca nu s-a depasit numarul de request-uri.
 */
const registerRequestsLimiterFunction = async (request, response, callback) => {
    registerRequestsLimiter.consume(request.ip).then(async () => {
        response.statusCode = 0;
        var callbackResponse = callback(request, response);

        while(response.statusCode === 0) {
            await utils.timeout(10);
        }

        if(response.statusCode === 201) {
            loginRequestsLimiter.delete(request.ip);
        }
        return callbackResponse;
    })
    .catch((exception) => {
        response.statusCode = 429; // 429 - Too Many Requests
        request.statusCodeMessage = "Too Many Requests";
        request.errorMessage = "Ai încercat să te înregistrezi de prea multe ori! Încearcă din nou peste 10 minute.";
        return errorRoute(request, response);
    });
};

module.exports = {loginRequestsLimiterFunction, registerRequestsLimiterFunction};