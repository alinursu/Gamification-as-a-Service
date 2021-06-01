var http = require('http');
var requestHandler = require('./src/core/requestHandler')

http.createServer(requestHandler).listen(8081, () => {
    console.log("Server-ul ruleaza pe port-ul 8081...");
});

// TODO: Modify gamification system page (modify the form.hbs page + new route '/profile/update_system_gamification?systemName=...' => PUT request)
    // DONE: Adauga buton de stergere a unui eveniment/recompensa
    // TODO: Flow final => sterge toate modelele dupa apikey, apoi adauga-le iar (rollback in caz de eroare)
    // Sterge din baza de date event-urile sterse si rewards-urile sterse
    // Updateaza in baza de date event-urile si rewards-urile existente, dar modificate
    // Insereaza in baza de date noile event-uri/rewards-uri introduse
    // Updateaza numele sistemului de gamification din baza de date
    // Posibilitate de a sterge tot sistemul (cu pop-up user confirmation)
    // Posibilitate de a anula modificarile (buton "cancel")
    // NU poti modifica API Key-ul!!

// TODO: Delete gamification system page (new route '/profile/delete_gamification_system?systemName=...' => DELETE request)
    // pagina noua cu numele sistemului, cheia api, numarul de evenimente, numarul de recompense + confirmare user

// TODO: create indexes to make searches faster:
    // INFO: https://www.google.com/search?client=firefox-b-d&q=phpmyadmin+mysql+create+index
    // username + password la users
    // api_key (+ name?) la gamification_rewards si gamification_events
    // api_key + id la gamification_user_data



// INFO gamification system: https://mambo.io/

// TODO: workflow apelare microservicii Gamification bazat pe un api key:
    // Se face un request la un link gen localhost:8081/gamification_service?apikey=382910830291830921
    // Pentru a lua codul api din link:
        // if(!url.contains(?)) => invalid request
        // querystring = url.split("?")[1]; // ceva gen apikey=382919321&ceva=1283912 etc.
        // queryData = parse(querystring); // ceva gen {'apikey':'382913821', 'ceva':'1283912'} etc
        // if(queryData.apikey == null) => not sufficient data
    // request de tip get:
        // pentru a lua date despre un user/top user la un badge, etc.
        // querystring trb sa contina, de asemenea, un id de user, ceva
    // request de tip post:
        // pentru a adauga date / pentru a updata datele unui user
        // in body trb sa am iduser, idbadge, etc.
    // request de tip put:
        // pentru a updata datele unui user ???

// TODO: Code refactor la import-uri (aranjare )
// TODO: stergere pachete npm nefolositoare
    // INFO: https://www.google.com/search?q=check+for+unused+npm+packages&client=firefox-b-d&sxsrf=ALeKk01K2LWYPhRHO7lnWEds-8XH90vPyA%3A1622408843183&ei=i_6zYJvZCsaUkwWp3oLADw&oq=check+for+unused+n&gs_lcp=Cgdnd3Mtd2l6EAMYADIFCAAQywEyBQgAEMsBMgUIABDLATIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjoHCCMQsAMQJzoHCAAQRxCwAzoGCCMQJxATOgQIIxAnOgQIABBDOgUIABCxAzoICAAQsQMQgwE6CAguELEDEIMBOgUILhCxAzoCCAA6BwgAELEDEENQhgdYpBhg1R1oAXACeACAAW6IAYsOkgEEMTUuNJgBAKABAaoBB2d3cy13aXrIAQnAAQE&sclient=gws-wiz