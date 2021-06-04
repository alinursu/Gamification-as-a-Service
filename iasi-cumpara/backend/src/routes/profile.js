const render = require("../core/render");
const path = require("path");

const profile = (req, res) => {
    const styles = ['products/searchresult', 'profile/view-profile', 'profile/view-profile-mobile']

    const paths = {
        head: path.join(__dirname, '../../pages/common/head.hbs'),
        header: path.join(__dirname, '../../pages/common/header.hbs'),
        profile: path.join(__dirname, '../../pages/views/profile.hbs'),
        footer: path.join(__dirname, '../../pages/common/footer.hbs')
    }

    return render(paths.head, {
        title: 'IaȘi Cumpără',
        styles: styles
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(data);

        return render(paths.header, null, (data) => {
            res.write(data);
            return render(paths.profile, null, (data) => {
                res.write(data);
                return render(paths.footer, null, (data) => {
                    res.write(data);
                    res.end();
                })
            })
        })
    })
}

module.exports = profile;