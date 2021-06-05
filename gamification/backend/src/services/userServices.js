var cookie = require("cookie");

const UserModel = require("../models/User");
const loginRoute = require("../routes/login");
const errorRoute = require("../routes/error");
const registerRoute = require("../routes/register");
const profileRoute = require("../routes/profile");
const usersRepository = require("../repositories/usersRepository");
const utils = require("../internal/utils");

/**
 * Genereaza o cheie (un token) unic, avand o lungime statica. Token-ul va fi folosit pentru a pastra un client logat (va fi stocat intr-un cookie in client-side).
 * @returns Token-ul generat.
 */
function generateAuthUniqueToken() {
  var tokenLength = 128;
  var token = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$^*_+-=.,<>/?;|";
  var charactersLength = characters.length;
  for (var i = 0; i < tokenLength; i++) {
    token.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return token.join("");
}

/**
 * Verifica daca am primit destule informatii pentru a putea procesa in continuare cererea de autentificare. Daca nu am primit, va construi raspunsul.
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca am primit destule informatii; 0, altfel
 */
function verifyPresenceOfLoginCredentials(userModel, request, response) {
  if (userModel.email == null || userModel.password == null) {
    response.statusCode = 400;
    request.statusCodeMessage = "Bad Request";
    request.errorMessage =
      'Request-ul de tip POST primit la pagina "/login" nu este unul valid!';
    errorRoute(request, response);
    return 0;
  }

  if (userModel.email.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Câmpul adresei de email nu poate fi gol!";
    loginRoute(request, response);
    return 0;
  }

  if (userModel.password.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Câmpul parolei nu poate fi gol!";
    request.previousEmailValue = userModel.email;
    loginRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Verifica daca datele primite de la client pentru cererea de autentificare sunt valide. Daca nu sunt, va construi raspunsul.
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca datele sunt valide; 0, altfel
 */
function validateLoginCredentials(userModel, request, response) {
  if (!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(userModel.email)) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Adresa de email nu este validă!";
    request.previousEmailValue = userModel.email;
    loginRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Genereaza un cookie, reprezentand starea autentificarii clientului, pe care il va trimite catre acesta.
 * @param {*} expiresIn24Hours Indica daca cookie-ul ar trebui sa expire in 24ore (expiresIn24Hours='on') sau la inchiderea sesiunii (expiresIn24Hours=null).
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns Valoarea token-ului care a fost generat pentru cookie-ul creat.
 */
function generateAuthCookie(expiresIn24Hours, request, response) {
  var tokenValue = generateAuthUniqueToken();
  if (expiresIn24Hours == null) {
    response.setHeader("Set-Cookie", cookie.serialize("authToken", tokenValue));
  } else {
    response.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", tokenValue, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
      })
    );
  }

  return tokenValue;
}

/**
 * Verifica daca am primit destule informatii pentru a putea procesa in continuare cererea de inregistrare. Daca nu am primit, va construi raspunsul.
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca am primit destule informatii; 0, altfel
 */
function verifyPresenceOfRegisterCredentials(userModel, request, response) {
  if (
    userModel.lastname == null ||
    userModel.firstname == null ||
    userModel.email == null ||
    userModel.password == null ||
    userModel.url == null
  ) {
    response.statusCode = 400;
    request.statusCodeMessage = "Bad Request";
    request.errorMessage =
      'Request-ul de tip POST primit la pagina "/register" nu este unul valid!';
    errorRoute(request, response);
    return 0;
  }

  if (userModel.lastname.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    request.errorMessage = "Câmpul numelui nu poate fi gol!";
    registerRoute(request, response);
    return 0;
  }

  if (userModel.firstname.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    request.errorMessage = "Câmpul prenumelui nu poate fi gol!";
    registerRoute(request, response);
    return 0;
  }

  if (userModel.email.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    request.errorMessage = "Câmpul adresei de email nu poate fi gol!";
    registerRoute(request, response);
    return 0;
  }

  if (userModel.password.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    request.errorMessage = "Câmpul parolei nu poate fi gol!";
    registerRoute(request, response);
    return 0;
  }

  if (userModel.url.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    request.errorMessage = "Câmpul adresei site-ului web nu poate fi gol!";
    registerRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Verifica daca datele primite de la client pentru cererea de inregistrare sunt valide. Daca nu sunt, va construi raspunsul.
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca datele sunt valide; 0, altfel
 */
function validateRegisterCredentials(userModel, request, response) {
  if (!/^[A-Za-z]+$/.test(userModel.lastname)) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Numele nu este valid!";
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    registerRoute(request, response);
    return 0;
  }

  if (!/^[A-Za-z]+$/.test(userModel.firstname)) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Prenumele nu este valid!";
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    registerRoute(request, response);
    return 0;
  }

  if (!/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(userModel.email)) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Adresa de email nu este validă!";
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    registerRoute(request, response);
    return 0;
  }

  if (userModel.password.length < 6) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Parola trebuie să conțină cel puțin 6 caractere!";
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    registerRoute(request, response);
    return 0;
  }

  if (
    !/^((http|https):\/\/)?[A-Za-z]+\.([A-Za-z]+\.|[A-Za-z]+)+[\/]?[[A-Za-z0-9/.=+?"'!@#$%^&*() -_]*]?$/.test(
      userModel.url
    )
  ) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Adresa site-ului web nu este validă!";
    request.previousLastnameValue = userModel.lastname;
    request.previousFirstnameValue = userModel.firstname;
    request.previousEmailValue = userModel.email;
    request.previousUrlValue = userModel.url;
    registerRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Verifica daca am primit destule informatii pentru a putea procesa in continuare cererea de schimbare a adresei site-ului web. Daca nu am primit, va construi raspunsul.
 * @param {*} previusURL Adresa anterioara, cea salvata in baza de date
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca am primit destule informatii; 0, altfel
 */
function verifyPresenceOfChangeURLCredentials(
  previousURL,
  userModel,
  request,
  response
) {
  if (userModel.url == null) {
    response.statusCode = 400;
    request.statusCodeMessage = "Bad Request";
    request.errorMessage =
      'Request-ul de tip PUT primit la pagina "/profile/change_url" nu este unul valid!';
    errorRoute(request, response);
    return 0;
  }

  if (userModel.url.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Câmpul adresei site-ului web nu poate fi gol!";
    request.previousURLValue = previousURL;
    profileRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Verifica daca datele primite de la client pentru cererea de schimbare a adresei site-ului web sunt valide. Daca nu sunt, va construi raspunsul.
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca datele sunt valide; 0, altfel
 */
function validateChangeURLCredentials(userModel, request, response) {
  if (
    !/^((http|https):\/\/)?[A-Za-z]+\.([A-Za-z]+\.|[A-Za-z]+)+[\/]?[[A-Za-z0-9/.=+?"'!@#$%^&*() -_]*]?$/.test(
      userModel.url
    )
  ) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Adresa site-ului web nu este validă!";
    request.previousURLValue = userModel.url;
    profileRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Verifica daca am primit destule informatii pentru a putea procesa in continuare cererea de schimbare a parolei. Daca nu am primit, va construi raspunsul.
 * @param {*} oldPassword Valoarea introdusa de utilizator in campul "Old Password".
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca am primit destule informatii; 0, altfel
 */
function verifyPresenceOfChangePasswordCredentials(
  oldPassword,
  userModel,
  request,
  response
) {
  if (userModel.password == null) {
    response.statusCode = 400;
    request.statusCodeMessage = "Bad Request";
    request.errorMessage =
      'Request-ul de tip PUT primit la pagina "/profile/change_password" nu este unul valid!';
    errorRoute(request, response);
    return 0;
  }

  if (oldPassword.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Câmpul pentru parola veche nu poate fi gol!";
    profileRoute(request, response);
    return 0;
  }

  if (userModel.password.length == 0) {
    response.statusCode = 422; // 422 - Unprocessable Entity (missing data)
    request.errorMessage = "Câmpul pentru parola nouă nu poate fi gol!";
    profileRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Verifica daca datele primite de la client pentru cererea de schimbare a parolei sunt valide. Daca nu sunt, va construi raspunsul.
 * @param {*} oldPassword Valoarea introdusa de utilizator in campul "Old Password".
 * @param {*} dbOldPassword Parola veche, cea preluata din baza de date.
 * @param {*} userModel Modelul construit pe baza informatiilor primite de la client.
 * @param {*} request Cererea primita de la client.
 * @param {*} response Raspunsul dat de server.
 * @returns 1, daca datele sunt valide; 0, altfel
 */
function validateChangePasswordCredentials(
  oldPassword,
  dbOldPassword,
  userModel,
  request,
  response
) {
  if (oldPassword != dbOldPassword) {
    response.statusCode = 401; // 401 - Unauthorized
    request.errorMessage = "Parola veche nu este corectă!";
    profileRoute(request, response);
    return 0;
  }

  if (userModel.password.length < 6) {
    response.statusCode = 401; // 401 - Unauthorized
    request.errorMessage =
      "Noua parolă trebuie să conțină cel puțin 6 caractere!";
    profileRoute(request, response);
    return 0;
  }

  return 1;
}

/**
 * Preia din baza de date toate modelele User din baza de date.
 * @returns Lista modelelor User; -1, daca a aparut o eroare pe parcursul executiei.
 */
async function getAllUsers() {
  var dbResult = null;
  await usersRepository.getAllUsers().then(function (result) {
    dbResult = result;
  });

  while (dbResult == null) {
    await utils.timeout(10);
  }

  return dbResult;
}

module.exports = {
  verifyPresenceOfLoginCredentials,
  validateLoginCredentials,
  generateAuthCookie,
  verifyPresenceOfRegisterCredentials,
  validateRegisterCredentials,
  verifyPresenceOfChangeURLCredentials,
  validateChangeURLCredentials,
  verifyPresenceOfChangePasswordCredentials,
  validateChangePasswordCredentials,
  getAllUsers,
};
