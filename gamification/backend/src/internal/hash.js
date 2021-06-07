
var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$^*()_+-=[]{};:|,<.>/?~";
var salt = alphabet.length/2;

/**
 * Inverseaza un string.
 * @param {*} string String-ul care va fi inversat.
 * @returns String-ul inversat.
 */
function reverseString(string) {
    if(string == null) return null;
    
    if(string.length <= 1) {
        return string;
    }

    var splittedString = string.split("");
    var reverseSplittedString = splittedString.reverse();
    return reverseSplittedString.join("");
}

/**
 * Cripteaza un text.
 * @param {*} text Textul care va fi criptat.
 * @returns Criptarea textului.
 */
function encrypt(text) {
    if(text == null) return null;

    var encryptedText = ""

    for(var i=0; i<text.length; i++) {
        var position = alphabet.indexOf(text[i]);
        if(position === -1) {
            encryptedText = encryptedText + text[i];
            continue;
        }

        encryptedText = encryptedText + alphabet[(position + salt)%alphabet.length];
    }

    return reverseString(encryptedText);
}

/**
 * Decripteaza un text.
 * @param {*} text Textul care va fi decriptat.
 * @returns Textul decriptat.
 */
function decrypt(text) {
    if(text == null) return null;
    
    var decryptedText = "";
    for(var i=0; i<text.length; i++) {
        var position = alphabet.indexOf(text[i]);

        if(position === -1) {
            decryptedText = decryptedText + text[i];
            continue;
        }

        var decryptedPosition = position - salt;
        decryptedPosition = (decryptedPosition < 0) ? (alphabet.length + decryptedPosition) : (decryptedPosition % alphabet.length);
        
        decryptedText = decryptedText + alphabet[decryptedPosition];
    }

    return reverseString(decryptedText);
}

module.exports = {encrypt, decrypt};