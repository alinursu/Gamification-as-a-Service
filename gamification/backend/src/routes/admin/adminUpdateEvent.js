const renderPage = require("../../core/render");
const path = require("path");
const querystringParser = require("querystring");
const gamificationSystemRepository = require("../../repositories/gamificationSystemsRepository");

const adminUpdateEventRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../../pages/admin/updateEvent.hbs')
    }

    const queryString = request.url.split('?')[1];
    const queryObject = querystringParser.parse(queryString);

    try {
        if (!queryObject.id) {
            request.event = null;
        } else {
            request.eventId = queryObject.id
            request.event = await gamificationSystemRepository.getGamificationEventById(request.eventId);
        }
    } catch (error) {
        console.log(error);
        request.event = null;
    }

    return renderPage(paths.index, {event: request.event, styles: ['admin-update']}, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUpdateEventRoute;