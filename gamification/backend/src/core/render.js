const hbs = require('handlebars');
const fs = require('fs');

/**
 * Renders a .hbs page.
 * @param {*} filePath The path to the hbs file.
 * @param {*} vars The values that will be integrated into the hbs file.
 * @param {*} callback The function that will be invoked to process the file and data.
 */
const renderPage = (filePath, vars = null, callback) => {
    fs.readFile(filePath, (error, data) => {
        if(error) {
            console.log(error);
            callback(null);
        } else {
            const template = hbs.compile(data.toString());
            callback(template(vars));
        }
    })
};

module.exports = renderPage;