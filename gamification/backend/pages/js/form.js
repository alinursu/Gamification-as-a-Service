const add = document.getElementById("add-btn");
const form = document.getElementById('rec-form');

add.addEventListener('click', (event) => {
    event.preventDefault();
    const cards = form.getElementsByClassName('card-form');
    const numberOfCards = cards.length;

    const cardForm = document.createElement('div');
    cardForm.innerHTML = `<p>Selectează tipul de recompensă!</p>
            <input type="radio" id="badge${numberOfCards + 1}" name="alegere${numberOfCards + 1}" value="badge">
            <label for="badge${numberOfCards + 1}">Insignă</label> <br>
            <input type="radio" id="levels${numberOfCards + 1}" name="alegere${numberOfCards + 1}" value="level">
            <label for="levels${numberOfCards + 1}">Nivel</label> <br>
            <label for="name" class="nume-rec" id="nume-rec${numberOfCards + 1}">Nume recompensă:</label> <br>
            <input type="text" class="name" id="nume-rec${numberOfCards + 1}" name="recompensă">`;
    cardForm.className = 'card-form';

    form.insertBefore(cardForm, add);

})