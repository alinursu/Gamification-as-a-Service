const renderPage = require("../core/render");
const path = require("path");
const tokensRepository = require("../repositories/tokensRepository");

const adminTokensRoute = async (request, response) => {
    const paths = {
        index: path.join(__dirname, '../../pages/admin/tokens.hbs')
    }

    return renderPage(paths.index, {
        tokens: await tokensRepository.getAllTokens(),
        styles: ['admin-tokens']
    }, (data) => {
        response.write(data);
        response.end();
    });
}

module.exports = adminTokensRoute;