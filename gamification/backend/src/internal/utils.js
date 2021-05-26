/**
 * Intarzie executia asincrona timp de un anumit numar de milisecunde.
 * @param {*} ms Numarul de milisecunde cat va stagna executia
 * @returns O promisiune (care va avea status-ul "completed" cand s-a terminat intarzierea).
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {timeout};