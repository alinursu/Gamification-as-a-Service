const hbs = require('handlebars');
const fs = require('fs');

/**
 * Creez un tag numit "ifCompareStrings" ce poate fi folosit in fisierele .hbs.
 */
hbs.registerHelper('ifCompareStrings', function(string1, string2, options) {
    if(string1 == string2) { return options.fn(this); }
    return options.inverse(this);
});

/**
 * Randeaza un fisier .hbs.
 * @param {*} filePath Calea catre fisierul hbs.
 * @param {*} vars Valorile care vor fi integrate in fisierul hbs.
 * @param {*} callback Functia care va fi invocata pentru a procesa fisierul si datele.
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