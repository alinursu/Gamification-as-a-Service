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
        <h1>IaȘi Vinde!</h1>
        <h3>GamS (Gamification as a Service)</h3>
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
                    <li><a href="#33-announces-in-category-page-and-search-result-page">Announces in Category Page and Search Result Page</a></li>
                    <li><a href="#34-announce-page">Announce Page</a></li>
                    <li><a href="#35-new-announce-page">New Announce Page</a></li>
                </ol>
            </li>
            <li><a href="#4-use-cases">Use-cases</a>
            <ol>
                <li><a href="#41-the-user-register-or-log-into-an-account">The user register or log into an account</a></li>
                <li><a href="#42-the-user-post-a-new-announce">The user post a new announce</a></li>
                <li><a href="#43-the-user-search-announces-by-keywords">The user search announces by keywords</a></li>
                <li><a href="#44-the-user-expresses-his-intention-to-buy-a-product">The user expresses his intention to buy a product</a></li>
            </ol>
            </li>
            <li><a href="#5-future-objectives">Future objectives</a>
            <ol>
                <li><a href="#51-overview">Overview</a></li> 
                <li><a href="#52-database">Create a database</a></li> 
                <li><a href="#53-microservice">Microservice for each lesson</a></li>
            </ol> </li>
            <li><a href="#6-conclusion">Conclusion</a> </li>
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
        <p>"IaȘi Vinde!" was created by three students enrolled in the 2nd year at Faculty of Computer Science, Iași. At its base, it is a project which has to implement a Gamification System for giving rewards to the users (for example, achievements).</p>
    </section>
    <section id="introduction__project" role="doc-introduction">
        <h3>2.1. The Project</h3>
        <p>"IaȘi Vinde!" is an online exchange platform where persons around Iași can sell, buy or exchange personal objects. The projects provide the users a communication system between the buyer and the seller, an announce viewing system, a profile viewing one, etc.</p>
        <p>Because the platform is more like an intermediary in the selling, it can manage the achievement system with accuracy, providing both the buyer and the seller informations about the other person.</p>
    </section>
    <section id="introduction__gamification" role="doc-introduction">
        <h3>2.2. The Gamification System</h3>
        <p>The system provides achievements to the users depending on their activity, to reward both the seriousness and the frivolity of a user in his exchanges. Every user will have a certain score for every achievement, the score being the rating offered by the system for his behaviour in his exchanges.</p>
    </section>
    <section id="structure" role="doc-structure">
        <h2>3. User Interface</h2>
        <p>Every page in the user interface has a header, which contains a navbar with "Home" and "My Account" buttons and a searchbar, and a footer. If the device used by a user is a mobile one, with small screen dimensions, the navbar will become a burger-menu to make the website look cleaner.</p>
    </section>
    <section id="structure__landing" role="doc-structure">
        <h3>3.1. Landing Page</h3>
        <p>This is the first page a client will see. The page contains a quick menu, which redirects him to pages with announces from different categories, and a panel with the users with the biggest score for every achievement.</p>
    </section>
    <section id="structure__myacc" role="doc-structure">
        <h3>3.2. My Account Page</h3>
    </section>
    <section id="structure__myacc_logged" role="doc-structure">
        <h4>3.2.1. The user is logged in</h4>
        <p>A page is displayed to the user where he can view his profile, his active announces and where he can modify certain account settings (for example: password, email address, phone number, profile picture, etc.).</p>
    </section>
    <section id="structure__myacc_notlogged" role="doc-structure">
        <h4>3.2.2. The user is not logged in</h4>
        <p>A page containing two form is displayed to the user, the first form is for loggin in and the second on for registering a new account, only one form being active at a certain moment.</p>
    </section>
    <section id="structure__announceslist" role="doc-structure">
        <h3>3.3. Announces in Category Page and Search Result Page</h3>
        <p>All these pages have the same structure: a page containing a list of announces based on a chosen category / chosen keywords is displayed to the use. Because a page like this can list only 10 announces, if the search returns more than 10 results, more similare pages will be generated.</p>
    </section>
    <section id="structure__announce" role="doc-structure">
        <h3>3.4. Announce Page</h3>
        <p>The user can view a certain announce; he can view the product's photos, description, price and can contact the seller by viewing his phone number of sending an message through the platform. Also, in this page a client can choose to buy the product.</p>
    </section>
    <section id="structure__newannounce" role="doc-structure">
        <h3>3.5. New Announce Page</h3>
        <p>In this page, a user can choose to post a new announce for a personal product; he must specify the announce title, category, description, images, etc.</p>
    </section>
    <section id="use-cases" role="doc-structure">
        <h2>4. Use cases</h2>
        <p>Knowing that it's a web app, and each user have to take some skill-lessons and administrate them and his progress, he will need to have an account, so there are minimum 3 use-cases.</p>
    </section>
    <section id="use-cases__account" role="doc-structure">
        <h3>4.1. The user register or log into an account</h3>
        <p>The user can access the register / login page by clicking the "Contul meu" button from the navbar / burger-menu. He will be redirected to <a href="structure__myacc">My Account Page</a>.</p>
    </section>
    <section id="use-cases__newannounce" role="doc-structure">
        <h3>4.2. The user post a new announce</h3>
        <p>From the profile page, a user can access the page where he can post a new announce by clicking the "Adauga un anunt nou" button. He wil be redirected to <a href="structure__newannounce">New Announce Page</a>.</p>
    </section>
    <section id="use-cases__searchannounces" role="doc-structure">
        <h3>4.3. The user search announces by keywords</h3>
        <p>The user can perform a search based on keywords by entering them in the search bar from the navbar / burger-menu and pressing the "Search" icon. He will be redirected to  <a href="structure__announceslist">Search Result Page</a>, where he can find the result.</p>
    </section>
    <section id="use-cases__buyproduct" role="doc-structure">
        <h3>4.4. The user expresses his intention to buy a product</h3>
        <p>The user, having displayed a certain announce page, can press the "Cumpara" button, expressing his intention to buy the product. The seller will be notified.</p>
    </section>
    <section id="objectives" role="doc-structure">
        <h2>5. Future objectives</h2>
        <p>Knowing that the front-end is done, we can now focus on the back-end of our web-application. </p>
    </section>
    <section id="objectives__overview" role="doc-structure">
        <h3>5.1. Overview</h3>
        <p>We will implement the back-end using PHP programming language, also we'll use the MVC as the arhitecture of the project. </p>
    </section>
    <section id="objectives__db" role="doc-structure">
        <h3>5.2. Database</h3>
        <p>Knowing that our application will have users, with lesson-progress and credentials, we'll use a database based on MySQL language.</p>
    </section>
    <section id="objectives__microservice" role="doc-structure">
        <h3>5.3. Microservice</h3>
        <p>Knowing that each two lessons don't have anything in common, for each one we'll implement a microservice which will can be updated or modified on its own.</p>
    </section>
    <section id="conclusion" role="doc-structure">
        <h2>6. Conclusion</h2>
        <p>//TODO</p>
    </section>
    </header>
</body>
</html>