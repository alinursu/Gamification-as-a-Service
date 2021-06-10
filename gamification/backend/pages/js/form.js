const add = document.getElementById("add-btn");
const addEventButton = document.getElementById("add-event-btn");
const form = document.getElementById('rec-form');
var deleteButtons = document.getElementsByClassName("delete-button");

function onclickShowToolTip(node) {
    var tooltipTextNode = node.getElementsByClassName('tooltip-text')[0];
    if(tooltipTextNode.style.visibility === 'visible') {
        tooltipTextNode.style.visibility = 'hidden';
    }
    else {
        tooltipTextNode.style.visibility = 'visible';
    }
}

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

            <label for="name" class="nume-rec" id="punctaj${numberOfCards + 1}">Valoarea importanței recompensei:</label> <br>
            <div class="input-info-container">
                <input type="text" class="name" id="nume-rec${numberOfCards + 1}" name="punctaj${numberOfCards + 1}" placeholder="Valoare întreagă pozitivă">
                <div class="tooltip" onclick="onclickShowToolTip(this)"> 
                    <p style="margin-bottom: 0; margin-left: 0.5em; color:#423788;">?</p>
                    <div style="position: absolute; visibility: hidden; width:10px;">
                        <p class="tooltip-text" style="font-size: 14px;">Recompensele pot fi diferite ca și importanță. O recompensă este mai importantă decât 
                            alta dacă poate fi obtinuță mai greu și/sau are o semnificație mai puternică.</p>
                    </div>
                </div>  
            </div>

            <label for="name" class="nume-rec-2" id="nume-ev${numberOfCards + 1}">Numele evenimentului care controlează recompensa:</label> <br>
            <div class="input-info-container">
                <input type="text" class="name" id="nume-ev${numberOfCards + 1}" name="eveniment_recompensa${numberOfCards + 1}">
                <div class="tooltip" onclick="onclickShowToolTip(this)"> 
                    <p style="margin-bottom: 0; margin-left: 0.5em; color:#423788;">?</p>
                    <div style="position: absolute; visibility: hidden; width:10px;">
                        <p class="tooltip-text" style="font-size: 14px;">Care este numele evenimentului care va controla oferirea acestei recompense (evenimentul care va apărea 
                            și va duce la progresul unui utilizator pentru obținerea acestei recompense).</p>
                    </div>
                </div>  
            </div>

            <label for="name" class="nume-rec-2" id="valoare-ev${numberOfCards + 1}">Valoarea pentru care se va oferi recompensa:</label> <br>
            <div class="input-info-container">
                <input type="text" class="name" id="nume-ev${numberOfCards + 1}" name="valoare_eveniment${numberOfCards + 1}" placeholder="Valoare reală pozitivă">
                <div class="tooltip" onclick="onclickShowToolTip(this)"> 
                    <p style="margin-bottom: 0; margin-left: 0.5em; color:#423788;">?</p>
                    <div style="position: absolute; visibility: hidden; width:10px;">
                        <p class="tooltip-text" style="font-size: 14px;">Perioada de timp (exprimată în ore) de la prima apariție a evenimentului/Numărul minim de apariții 
                            a evenimentului, în funcție de tipul acestuia, după care se va oferi această recompensă utilizatorului.</p>
                    </div>
                </div>
            </div> <br>
            <button type="button" class="delete-button">Șterge</button>`;
    cardForm.className = 'card-form';

    form.insertBefore(cardForm, add);

    deleteButtons = document.getElementsByClassName("delete-button");
    for(var i=0; i<deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', (event) => {
            var parentNode = event.currentTarget.parentNode;
            parentNode.remove();
        });
    }
})

addEventButton.addEventListener('click', (event) => {
    event.preventDefault();
    const cards = form.getElementsByClassName('event-card-form');
    const numberOfCards = cards.length;

    const cardForm = document.createElement('div');
    cardForm.innerHTML = `<p>Selectează tipul de eveniment!</p>
            <div class="input-info-container">
                <input type="radio" id="time${numberOfCards + 1}" name="tip_eveniment${numberOfCards + 1}" value="time">
                <label for="time${numberOfCards + 1}">Bazat pe timp</label> 
                <div class="tooltip" onclick="onclickShowToolTip(this)"> 
                    <p style="margin-bottom: 0; margin-left: 0.5em; color:#423788;">?</p>
                    <div style="position: absolute; visibility: hidden; width: 10px;">
                        <p class="tooltip-text" style="font-size: 14px;">Utilizatorul va primi recompensa când evenimentul s-a întâmplat după o anumită perioadă de timp.</p>
                    </div>
                </div>              
            </div>

            <div class="input-info-container">
                <input type="radio" id="value${numberOfCards + 1}" name="tip_eveniment${numberOfCards + 1}" value="value">
                <label for="value${numberOfCards + 1}">Bazat pe un număr</label> 
                <div class="tooltip" onclick="onclickShowToolTip(this)"> 
                    <p style="margin-bottom: 0; margin-left: 0.5em; color:#423788;">?</p>
                    <div style="position: absolute; visibility: hidden; width: 10px;">
                        <p class="tooltip-text" style="font-size: 14px;">Utilizatorul va primi recompensa când evenimentul s-a întâmplat de un anumit număr de ori.</p>
                    </div>
                </div>              
            </div>
            <label for="name" class="nume-rec" id="nume-event${numberOfCards + 1}">Numele evenimentului:</label> <br>
            <input type="text" class="name" id="nume-event${numberOfCards + 1}" name="nume_eveniment${numberOfCards + 1}">
            <br> <br>
            <button type="button" class="delete-button">Șterge</button>`;
    cardForm.className = 'event-card-form';

    form.insertBefore(cardForm, addEventButton);

    deleteButtons = document.getElementsByClassName("delete-button");
    for(var i=0; i<deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', (event) => {
            var parentNode = event.currentTarget.parentNode;
            parentNode.remove();
        });
    }
});

for(var i=0; i<deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', (event) => {
        var parentNode = event.currentTarget.parentNode;
        parentNode.remove();
    });
}