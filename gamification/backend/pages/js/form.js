const add = document.getElementById("add-btn");
const addEventButton = document.getElementById("add-event-btn");
const form = document.getElementById('rec-form');

add.addEventListener('click', (event) => {
    event.preventDefault();
    const cards = form.getElementsByClassName('card-form');
    const numberOfCards = cards.length;

    const cardForm = document.createElement('div');
    cardForm.innerHTML = `<p>Selectează tipul de recompensă!</p>
            <input type="radio" id="badge${numberOfCards + 1}" name="tip_recompensa${numberOfCards + 1}" value="badge">
            <label for="badge${numberOfCards + 1}">Insignă</label> <br>
            <input type="radio" id="levels${numberOfCards + 1}" name="tip_recompensa${numberOfCards + 1}" value="level">
            <label for="levels${numberOfCards + 1}">Nivel</label> <br>
            <label for="name" class="nume-rec" id="nume-rec${numberOfCards + 1}">Numele recompensei:</label> <br>
            <input type="text" class="name" id="nume-rec${numberOfCards + 1}" name="nume_recompensa${numberOfCards + 1}"> <br>
            <label for="name" class="nume-rec" id="punctaj${numberOfCards + 1}">Valoarea importanței:</label> <br>
            <input type="text" class="name" id="nume-rec${numberOfCards + 1}" name="punctaj${numberOfCards + 1}" placeholder="Valoare întreagă pozitivă"> <br>
            <label for="name" class="nume-rec-2" id="nume-ev${numberOfCards + 1}">Numele evenimentului care controlează recompensa:</label> <br>
            <input type="text" class="name" id="nume-ev${numberOfCards + 1}" name="eveniment_recompensa${numberOfCards + 1}"> <br>
            <label for="name" class="nume-rec-2" id="valoare-ev${numberOfCards + 1}">Valoarea pentru care se va oferi recompensa:</label> <br>
            <input type="text" class="name" id="nume-ev${numberOfCards + 1}" name="valoare_eveniment${numberOfCards + 1}" placeholder="Valoare intreagă pozitivă">`;
    cardForm.className = 'card-form';

    form.insertBefore(cardForm, add);

})

addEventButton.addEventListener('click', (event) => {
    event.preventDefault();
    const cards = form.getElementsByClassName('event-card-form');
    const numberOfCards = cards.length;

    const cardForm = document.createElement('div');
    cardForm.innerHTML = `<p>Selectează tipul de eveniment!</p>
            <input type="radio" id="time${numberOfCards + 1}" name="tip_eveniment${numberOfCards + 1}" value="time">
            <label for="time${numberOfCards + 1}">Bazat pe timp</label> <br>
            <input type="radio" id="value${numberOfCards + 1}" name="tip_eveniment${numberOfCards + 1}" value="value">
            <label for="value${numberOfCards + 1}">Bazat pe o valoare</label> <br>
            <label for="name" class="nume-rec" id="nume-event${numberOfCards + 1}">Numele evenimentului:</label> <br>
            <input type="text" class="name" id="nume-event${numberOfCards + 1}" name="nume_eveniment${numberOfCards + 1}">`;
    cardForm.className = 'event-card-form';

    form.insertBefore(cardForm, addEventButton);
});