const hbs = require('handlebars')
const fs = require('fs')

const render = (path, vars = null) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err,data) => {
            if(err) {
                reject(err);
            } else {
                const template = hbs.compile(data.toString())
                resolve(template(vars))
            }
        })
    })
}

module.exports = render