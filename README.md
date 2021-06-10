# Proiect-TW
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <header>
        <h1>GamS (Gamification as a Service)</h1>
        <dl>
            <dt>Authors</dt>
            <dd><a href="https://github.com/BejanLuciana">Bejan Luciana</a> (2B4), <a href="https://github.com/MirceaSofrone">Sofrone Mircea</a> (2A6) and <a href="https://github.com/ursualin7890">Ursu Alin</a> (2B4)</dd>
            <dt>Coordinator</dt>
            <dd><a href="https://github.com/acip">Amariei Ciprian</a></dd>
            <dt>Faculty of Computer Science, "Alexandru Ioan Cuza" University, Iași, Romania</dt>
            <dt>Web Tehnologies Course</dt>
        </dl>
    <div role="contentinfo">
        <ol role="directory">
            <li><a href="#1-project-details">Project Details</a> </li>
            <li><a href="#2-introduction">Introduction</a> </li>
            <ol>
                <li><a href="#21-the-project">The Project</a></li>
                <li><a href="#22-the-gamification-system">The Gamification System</a></li>
            </ol>
            <li><a href="#3-user-interface">User Interface</a>
                <ol role="structure-directory">
                    <li><a href="#31-landing-page">Landing</a></li>
                    <li><a href="#32-my-account-page">My Account Page</a></li>
                    <ol>
                        <li><a href="#321-the-user-is-logged-in">The user is logged in</a></li>
                        <li><a href="#322-the-user-is-not-logged-in">The user is not logged in</a></li>
                    </ol>
                    <li><a href="#33-gamification-system-creation-page">Gamification System Creation Page</a></li>
                    <li><a href="#34-gamification-system-view-page">Gamification System View Page</a></li>
                    <li><a href="#35-gamification-system-modify-page">Gamification System Modify Page</a></li>
                    <li><a href="#36-documentation-page">Documentation page</a></li>
                    <li><a href="#37-admin-panel">Admin panel</a></li>
                </ol>
            </li>
            <li><a href="#4-use-cases">Use-cases</a>
            <ol>
                <li><a href="#41-the-user-creates-a-new-gamification-system">The user creates a new gamification system</a></li>
                <li><a href="#42-the-user-views-one-of-his-gamification-systems">The user views one of his gamification systems</a></li>
                <li><a href="#43-the-user-modifies/deletes-one-of-his-gamification-systems">The user modifies/deletes one of his gamification systems</a></li>
                <li><a href="#44-the-user-wants-to-access-the-admin-panel">The user wants to access the admin panel</a></li>
                <li><a href="#45-the-user-wants-to-access/post-data-about-a-gamification-system">The user wants to access/post data about a gamification system</a></li>
            </ol>
            </li>
            <li><a href="#5-implementations">Implementations</a>
            <ol>
                <li><a href="#51-project-structure">Project Structure</a></li> 
                <li><a href="#52-generating-pages-in-backendvia-templates-(handlebars)">Generating pages in backend via templates (handlebars)</a></li> 
                <li><a href="#53-pages-routing">Pages routing</a></li>
                <li><a href="#54-user-authentication">User authentication</a></li>
                <li><a href="#55-the-database">The database</a></li>
                <li><a href="#56-security">Security</a></li>
                <li><a href="#57-used-online-packages">Used online packages</a></li>
            </ol> 
            </li>
            <li><a href="#6-example">Website example ("IaȘi Cumpără!")</a>
            <ol>
                <li><a href="#61-website-overview">Website overview</a></li> 
                <li><a href="#62-how-the-gamification-systems-are-implemented">How the gamification systems are implemented</a></li>
            </ol> 
            </li>
        </ol>
    </div>
    <section id="project-details" role="doc-abstract">
        <h2>1. Project details</h2>
        <p>Sa se creeze o aplicatie Web care va permite integratorilor includerea unui sistem de gamification propriei aplicatii. Sistemul va permite doua variante: a) oferirea de insigne (badge-uri) de genul One Day Streak, First Post, First Comment etc. si b) niveluri pentru utilizatori (newbie, lurker, squire, grand master etc.). In procesul de configurare, integratorul va putea defini o serie de evenimente (creare mesaj, creare comentariu, creare cont, a trecut un an de la crearea contului, autentificare etc.). Integratorul va putea defini conditiile necesare pentru atribuirea unui badge sau trecerea de la un nivel la altul. Acestea pot fi evenimente, badge-uri sau nivelul curent al utilizatorului. Se va implementa un API REST/GraphQL (ce va folosi o metoda de autentificare) pentru a oferi functionalitatea asociata evenimentelor si a situatiei curente a unuia sau mai multor utilizatori. De asemenea, se va returna si clasamentul curent.</p>
        <p>Evenimentele pot fi declansate in urma unei cereri sau in functie de timp (de pilda, a trecut o saptamana de la crearea contului). Ele au asociate si un punctaj. Se va implementa si o aplicatie care integreaza sistemul.</p>
        <p>Bonus: recurgerea la o maniera vizuala atractiva pentru a putea identifica relatiile intre evenimente, badge-uri, niveluri etc.</p>
    </section>
    <section id="introduction" role="doc-introduction">
        <h2>2. Introduction</h2>
        <p>"GamS" was created by three students enrolled in the 2nd year at Faculty of Computer Science, Iași. 
At its base, it is an external service that give developers/website owners an easy-to-use and already implemented way to award the users of 
a website without worrying about the implementation.</p>
    </section>
    <section id="introduction__project" role="doc-introduction">
        <h3>2.1. The Project</h3>
        <p>"GamS", as its name says, is an platform that offers a simple way of implementing and managing one or more gamification
systems. Through its website interface, a website owner can create and manage gamification systems and their objects (rewards
that will be given to end-users and events that will happen sometime)</p>
        <p>Through its external API, a website owner can request data about a certain user, can request a top of users based on
their score, can specify when a certain event happened, etc. These data will be returned in a JSON format.</p>
        <p>The only thing that a website owner/developer must implement to make use of the benefits offered by "GamS" are the
external API calls and the processing of response.</p>
    </section>
    <section id="introduction__gamification" role="doc-introduction">
        <h3>2.2. The Gamification System</h3>
        <p>A gamification system contains one or more events, that will modify a certain user's progress on some rewards, and
one or more rewards that will be given to end-users. For a better way of managing the achievements, a website owner can 
create multiple systems, each system having their own events and rewards, for one website, each system having a certain 
unique API key that can be used to access it.</p>
    </section>
    <section id="structure" role="doc-structure">
        <h2>3. User Interface</h2>
        <p>Every page in the user interface has a header and a footer which contains anchors for relevant useful pages and 
some informations about the platform and its creators. If the device used by a user is a mobile one, with small screen dimensions, 
the navbar will become a burger-menu to make the website look cleaner.</p>
    </section>
    <section id="structure__landing" role="doc-structure">
        <h3>3.1. Landing Page</h3>
        <p>This is the first page a client will see. On this page a website owner can read some informations about how to use 
the platform, its offerings and how easy is to create and integrate a gamification system into your already-built website.</p>
    </section>
    <section id="structure__myacc" role="doc-structure">
        <h3>3.2. My Account Page</h3>
    </section>
    <section id="structure__myacc_logged" role="doc-structure">
        <h4>3.2.1. The user is logged in</h4>
        <p>A page is displayed to the user where he can view his profile, his gamification systems and where he can modify certain 
account settings (password, website url).</p>
    </section>
    <section id="structure__myacc_notlogged" role="doc-structure">
        <h4>3.2.2. The user is not logged in</h4>
        <p>He will be redirected to the login page. If the client doesn't have an account, he can create one via register page.</p>
    </section>
    <section id="structure__creationpage" role="doc-structure">
        <h3>3.3. Gamification System Creation Page</h3>
        <p>Once a client is logged in, via his profile page, he can choose to create one or more gamification systems for his website.
In this page, a user-friendly interface is displayed where he can create it in no time. For a system to be valid, it must contain a name, at least one event and at least one reward.</p>
    <p>After the system has been created, the newly system's generated API key will be displayed and, also, the gamification system
can be seen on user's profile page.</p>
    </section>
    <section id="structure__viewpage" role="doc-structure">
        <h3>3.4. Gamification System View Page</h3>
        <p>Here a client can view more informations about one of its gamification systems, informations such as the events, the rewards,
the API key, etc. Here he can also delete the system, all data about it being erased.</p>
    </section>
    <section id="structure__modifypage" role="doc-structure">
        <h3>3.5. Gamification System Modify Page</h3>
        <p>In a similar interface as the creation page, the user can modify (create/delete events, create/delete rewards, change 
system's name, modify event/reward types, modify event/reward values, etc.) an already created gamification system.</p>
    </section>
    <section id="structure__documentationpage" role="doc-structure">
        <h3>3.6. Documentation page</h3>
        <p>Using images, this page offers some visually-attractive easy steps for creating, managing and implementing a gamification
system to a developer/website owner.</p>
    </section>
    <section id="structure__adminpanel" role="doc-structure">
        <h3>3.7. Admin panel</h3>
        <p>This panel can only be accessed by "GamS" users marked as admins. In the pages of this panel, an admin can perform
CRUD operations over the database.</p>
    </section>
    <section id="use-cases" role="doc-structure">
        <h2>4. Use cases</h2>
        <p>Knowing that it's a web app, and each user have to take some skill-lessons and administrate them and his progress, he will need to have an account, so there are minimum 3 use-cases.</p>
    </section>
    <section id="use-cases__newsystem" role="doc-structure">
        <h3>4.1. The user creates a new gamification system</h3>
        <p>Once logged in, he can create a new gamification system by clicking the "Creează un sistem nou" button from his profile page.
He will be redirected to <a href="structure__myacc">Gamification System Creation Page</a>.</p>
    </section>
    <section id="use-cases__viewsystem" role="doc-structure">
        <h3>4.2. The user views one of his gamification systems</h3>
        <p>From the profile page, a user can view details about one of his gamification systems by choosing one from the list displayed. 
He wil be redirected to <a href="structure__newannounce">Gamification System View Page</a>.</p>
    </section>
    <section id="use-cases__modifydeletesystem" role="doc-structure">
        <h3>4.3. The user modifies/deletes one of his gamification systems</h3>
        <p>From the gamification system view page, a user cand modify/delete it by pressing the "Modifică"/"Șterge" button. 
He will be redirected to <a href="structure__announceslist">Gamification System Modify Page</a>, where he can find the result.</p>
    </section>
    <section id="use-cases__adminpanel" role="doc-structure">
        <h3>4.4. The user wants to access the admin panel</h3>
        <p>Once he is logged in, if he have the right privileges, he can access the admin panel through its profile page. He 
will be redirected to <a href="structure__myacc">Admin panel</a>. </p>
    </section>
    <section id="use-cases__datasystem" role="doc-structure">
        <h3>4.5. The user wants to access/post data about a gamification system</h3>
        <p>A website owner/developer can access/post data about their clients via the external API offered by "GamS". All the data
is stored inside the platform.</p>
    </section>
    <section id="implementations" role="doc-structure">
        <h2>5. Implementations</h2>
    </section>
    <section id="implementations__structure" role="doc-structure">
        <h3>5.1. Project structure</h3>
        <p>The server side of the application is implemented using Node.js, having a complex MVC (Model-View-Controller) architecture.</p>
        <p>Whenever a request from a user appears, it will be passed by the Request Handler to the Routing layer. Based on the
type of the request and the URL where it appeared, the Routing layer will pass it to the Controller layer. The Controller layer
will invoke a number of services from the Services Layer, those services invoking methods from the Repository Layer (who communicates with
the database). Once the request has been handled on the Controller Layer, a HTML response will be generated withing the Routes Layer
and the response will be sent back to the user.</p>
        <p>If a database error appears, the user will be redirected to a error page (500 Internal Server Error).</p>
        <p>If a request happens to appear on an unknown page (404 Not Found) or the user doesn't have access to the certain page,
a error page (403 Forbidden) will be generated and sent back to the user from the Routing Layer.</p>
        <p>The external API calls follows the exact same workflow, but, since it doesn't return a HTML-formatted response, but in 
JSON format, the Routes Layer will never be accessed.</p>
    </section>
    <section id="implementations__handlebars" role="doc-structure">
        <h3>5.2. Generating pages in backend via templates (handlebars)</h3>
        <p>Using HTML templates (also called handlebars, or hbs) the server will generate HTML pages as responses for requests. On 
these templates, certain informations (such as account's name, account's website URL, account's gamification systems, etc.) can be
inserted directly on the HTML code.</p>
        <p>In this manner, we avoid duplicate code and we don't violate the DRY (Don't Repeat Yourself) principle.</p>
    </section>
    <section id="implementations__routing" role="doc-structure">
        <h3>5.3. Pages routing</h3>
        <p>The HTML pages given as responses are generated using HTML templates and by inserting some data into them (see the 
<a href="structure__announceslist">Generating pages in backend via templates (handlebars)</a> section). All static files (css,
client-side js, images, etc) have a unique route and are downloaded whenever it's necessary.</p>
        <p>Based on the response given, the right HTTP status code will be returned to the user.</p>
    </section>
    <section id="implementations__auth" role="doc-structure">
        <h3>5.4. User authentication</h3>
        <p>To mentain a user logged in, a cookie will be created and stored inside the browser storage. The cookie will contain
a string (called Token) having a fixed length (128). To keep the link between the session and the account that the user has been logged in,
the token is also stored inside the platform's database.</p>
    </section>
    <section id="implementations__db" role="doc-structure">
        <h3>5.5. The Database</h3>
        <p>The platform uses a MySQL database server (offered by <a href="https://www.freemysqlhosting.net/">Free MySQL Hosting</a>) and
can be manually managed via the <a href="phpmyadmin.co">phpmyadmin</a> page.</p>
    </section>
    <section id="implementations__security" role="doc-structure">
        <h3>5.6. Security</h3>
        <p>The application takes the following actions to prevent attacks:</p>
        <ul>
            <li>It uses parameterized SQL queries to prevent SQL Injection.</li>
            <li>Most of the data stored in the database is encrypted (users data, gamification systems data, etc.).</li>
            <li>An authentication token has a length of 128 characters, which makes it impossible to brute force it.</li>
            <li>A gamification system API key has a length of 64 characters, which makes it impossible to brute force it.</li>
            <li>An user cannot access/view/modify another user's gamification systems.</li>
            <li>Login and register requests are limited to 10 requests once every 10 minutes for every IP to prevent the server overloading 
(to prevent DDoS attacks) and to make brute forcing attacks over accounts almost impossible.</li>
        </ul>
    </section>
    <section id="implementations__packages" role="doc-structure">
        <h3>5.7. Used online packages</h3>
        <p>The application uses the following npm packages: </p>
        <ul>
            <li><a href="https://www.npmjs.com/package/cookie">cookie</a>, to parse and serialize cookies.</li>
            <li><a href="https://www.npmjs.com/package/formidable">formidable</a>, to parse file uploads (CSV files).</li>
            <li><a href="https://www.npmjs.com/package/handlebars">handlebars</a>, to parse, manage and insert data into HTML templates.</li>
            <li><a href="https://www.npmjs.com/package/json2csv">json2csv</a>, to convert data from JSON format to CSV format.</li>
            <li><a href="https://www.npmjs.com/package/mysql">mysql</a>, to communicate with the MySQL Database Server (driver).</li>
            <li><a href="https://www.npmjs.com/package/node-static">node-static</a>, to serve the static files (CSS, client-side JS, images, etc.).</li>
            <li><a href="https://www.npmjs.com/package/rate-limiter-flexible">rate-limiter-flexible</a>, to limit the number of certain requests.</li>
        </ul>
    </section>
    <section id="example" role="doc-structure">
        <h2>6. Website example ("IaȘi Cumpără!")</h2>
    </section>
    <section id="example__overview" role="doc-structure">
        <h3>6.1. Website overview</h3>
        <p>"IaȘi Cumpără!" is an online store for users around Iași district. It offers a large variety of products: phones,
laptops, houses, cars, etc.</p>
    </section>
    <section id="example__implemented" role="doc-structure">
        <h3>6.2. How the gamification systems are implemented</h3>
        <h4>The gamification system ("Cumpărături și comentarii"): </h4>
        <p>The events created:</p>
        <ul>
            <li>"produs-cumpărat" -> Based on how many times the event appeared.</li>
            <li>"comentariu-adăugat" -> Based on how many times the event appeared.</li>
            <li>"cont-creat" -> Based on when the event first appeared.</li>
        </ul>
        <p>The rewards created:</p>
        <ul>
            <li>"50 produse cumpărate" (Badge) -> It is controlled by the "produs-cumpărat" event and have a value of 100 points.</li>
            <li>"100 produse cumpărate" (Badge) -> It is controlled by the "produs-cumpărat" event and have a value of 500 points.</li>
            <li>"10 comentarii adăugate" (Badge) -> It is controlled by the "comentariu-adăugat" event and have a value of 10 points.</li>
            <li>"Nou-venit" (Level) -> It is controlled by the "cont-creat" event and have a value of 50 points.</li>
            <li>"Veteran" (Level) -> It is controlled by the "cont-creat" event and have a value of 1000 points.</li>
        </ul>
        <br>
        <p>Everytime an end-user buys a product, a POST request will be sent to the Gamification External API, containing the
event name ("produs-cumpărat") and the id of the client's account. This will increase the user's progress on every reward that
is controlled by this event.</p>
        <p>Everytime an end-user buys adds a comment on a product page, a POST request will be sent to the Gamification External API, containing the
event name ("comentariu-adăugat") and the id of the client's account. This will increase the user's progress on every reward that
is controlled by this event.</p>
        <p>Everytime an end-user access the index page of the website, a GET request of the top of users will be sent to the Gamification
External API and the users, alongside their scores, will be displayed on the page.</p>
        <p>Everytime an end-user access their profile page, a GET request of his rewards will be sent to the Gamification
External API and the rewards and his progress on them will be displayed on the page.</p>
    </section>
    </header>
</body>
</html>
