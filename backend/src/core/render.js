const hbs = require('handlebars');
const fs = require('fs');

const render = (path, vars = null, cb) => {
    fs.readFile(path, (err, data) => {
        if(err) {
            console.log(err);
            cb(null);
        }else {
            const template = hbs.compile(data.toString());
            cb(template(vars));
        }
    })
};

module.exports = render;