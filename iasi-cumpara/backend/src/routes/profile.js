const render = require("../core/render");
const path = require("path");

const profile = (req, res) => {
    const styles = ['products/searchresult', 'profile/view-profile', 'profile/view-profile-mobile']

    const paths = {
        head: path.join(__dirname, '../components/General/head.hbs'),
        profile: path.join(__dirname,'../pages/profile.hbs'),
        footer: path.join(__dirname, '../components/General/footer.hbs')
    }

    return render(paths.head, {
        title: 'IaȘi Vinde',
        styles: styles
    }, (data) => {
        res.writeHead(200, {'Content-Type': 'text/html'}); // http header
        res.write(data);

        return render(paths.profile, null, (data) => {
            res.write(data);
            return render(paths.footer, null, (data) => {
                res.write(data);
                res.end();
            })
        })
    })
}

module.exports = profile;