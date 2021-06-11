const hbs = require('handlebars')
const fs = require('fs')

const render = (path, vars = null, callback) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err,data) => {
            if(err) {
                reject(err);
                callback(null);
            } else {
                const template = hbs.compile(data.toString())

                if(callback != null) callback(template(vars))
                else resolve(template(vars))
            }
        })
    })
}

module.exports = render