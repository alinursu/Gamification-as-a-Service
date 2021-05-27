const add = document.getElementById("add-btn");
const form = document.getElementById('rec-form');

add.addEventListener('click', (event) =>{
    event.preventDefault();
    const cards = form.getElementsByClassName('card-form');
    const numberOfCards = cards.length;

    form.innerHTML = form.innerHTML + `<div class="card-form">
            <p>Selectează tipul de recompensă!</p>
            <input type="radio" id="badge${numberOfCards + 1}" name="alegere${numberOfCards + 1}">
            <label for="badge${numberOfCards + 1}">Insignă</label> <br>
            <input type="radio" id="levels${numberOfCards + 1}" name="alegere${numberOfCards + 1}">
            <label for="levels${numberOfCards + 1}">Nivel</label> <br>
            <label for="name" class="nume-rec" id="nume-rec${numberOfCards + 1}">Nume recompensă:</label> <br>
            <input type="text" class="name" id="nume-rec${numberOfCards + 1}" name="recompensă">
            <br>
        </div>`
})