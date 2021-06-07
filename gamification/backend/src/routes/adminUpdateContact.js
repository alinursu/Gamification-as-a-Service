const renderPage = require("../core/render");
const path = require("path");
const querystringParser = require("querystring");
const gamificationContactRepository = require("../repositories/ContactMessagesRepository");

const adminUpdateContactRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/updateContact.hbs')
    }

    const queryString = request.url.split('?')[1];
    const queryObject = querystringParser.parse(queryString);

    try {
        if (!queryObject.id) {
            request.contact = null;
        } else {
            request.contactId = queryObject.id
            request.contact = await gamificationContactRepository.getGamificationContactById(request.contactId);
        }
    } catch (error) {
        console.log(error);
        request.event = null;
    }

    return renderPage(paths.index, {contact: request.contact, styles: ['admin-update']}, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminUpdateContactRoute;