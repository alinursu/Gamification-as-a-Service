var http = require('http');
var requestHandler = require('./src/core/requestHandler')

http.createServer(requestHandler).listen(8081, () => {
    console.log("Server-ul ruleaza pe port-ul 8081...");
});

// --- NOT ANYMORE --
// INFO: https://stackoverflow.com/questions/1354999/keep-me-logged-in-the-best-approach
// INFO node.js cookies: https://www.google.com/search?client=firefox-b-d&q=node+js+create+cookie
// TODOs:
    // Retine logarea unui utilizator in sessionStorage: user_id, first_name, last_name
    // Daca exista un user_id in sessionStorage, sa imi afiseze header-ul logat (+ numele in el)
    // Functionalitate logout
    // Posibilitate "Pastreaza-ma autentificat timp de 24ore" => cookie (vezi primul link)
// --- NOT ANYMORE --



// INFO COOKIE (destroy, get, set, etc.): https://www.geeksforgeeks.org/http-cookies-in-node-js/
// INFO COOKIE 2: https://gist.github.com/substack/7c03c37b5ff03aca2915
    // By default, cookies expire as soon as the user closes their browser.
    // Documentation: https://www.npmjs.com/package/cookie
        // In exemplu arata si cum redirectionezi spre o alta pagina!
    // INFO redirect: https://stackoverflow.com/questions/21191829/how-to-redirect-to-another-page-without-express
        // response.writeHead(307, {'Location': '/'}); // 307 - Temporary Redirect
        // response.end();
// TODO: Workflow login:
    // DONE: Se logheaza, se creeaza un cookie care expira la inchiderea sesiunii
        // DONE: Daca bifeaza "remeber me", expira dupa 24h
    // DONE: In cookie se retine un token
        // DONE: genereaza un token
    // TODO: Token-ul este, de asemenea, salvat in DB, impreuna cu userID, userFname si userLname
    // DONE: Esti redirectionat catre pagina principala
    // DONE: Cand se face un request la o pagina web, se trimite si token-ul din cookie si, in server-side, pe baza token-ului, se adauga date (daca sunt afisate date in pagina)
            // TODO: in server-side, pe baza token-ului, se adauga date (daca sunt afisate date in pagina)


//--  ce am facut? --
// DONE: Workflow login -> functionarea login-ului cu caracter persistent (pe timpul sesiunii sau pentru 24 de ore)
// DONE: /profile nu poate fi accesat daca nu exista un cookie cu cheia 'loginToken' (daca nu este logat client-ul) => 403 Forbidden
// DONE: /login si /register nu pot fi accesate daca exista un cookie cu cheia 'loginToken' (daca este logat client-ul) => redirect la homepage
// DONE: bugs fixed on error page and at redirect behaviour
// DONE: comportament logout buttons, comportament change password/url
    // INFO why POST instead of PUT on change password: https://security.stackexchange.com/questions/63604/put-vs-post-for-password-update
    // INFO why POST instead of PUT on change url: https://stackoverflow.com/questions/8054165/using-put-method-in-html-form ( nu exista <form method="put"> in HTML; este vazut ca <form> (GET) which is not ok)
        // Am adaugat suport atat pentru POST, cat si pentru PUT, chiar daca in HTML folosesc doar POST (PUT pentru postman, api-uri, etc.)
// DONE: added error/success messages on requests
// DONE: Added service layer, which contains functions that will be invoked by controllers
    //--  ce am facut? --


// DONE: comportament logout buttons
// DONE: comportament change password/url
// DONE: la register, dupa toata cacialmaua, sa se afiseze un mesaj
// DONE: de modificat din logintoken in authtoken la cookie (+numele functiei ce genereaza un token)
// DONE: controller-ul apeleaza functii din service, iar service apeleaza functii din repository, ce comunica cu db
// TODO: de creat request-uri pentru POSTMAN pentru pagini greu de exemplificat prin browser (pentru 404 not found, pentru 403 forbidden la post, post la login cand esti deja autentificat etc.)
    // bad post login: localhost:8081/login; body => raw => message=asd&text=asd    
    // incomplete post login: localhost:8081/login; body => raw => message=asd&password=asd    
    // post login: localhost:8081/login ; body=>raw=> email=asd@asd.com&password=asd

// TODO-BUG: CONSOLE => GET http://localhost:8081/favicon.ico [HTTP/1.1 404 Not Found 0ms]

