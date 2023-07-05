const showAllBtn = document.getElementById('showAllBtn');
const restaurantForm = document.getElementById('restaurantForm');
const resultDiv = document.getElementById('result');


function addCard(restaurant) {
    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h2");
    name.textContent = restaurant.name;

    const addresse = document.createElement("p");
    addresse.textContent = "Adresse: " + restaurant.addresse;

    const kategorie = document.createElement("p");
    kategorie.textContent = "Kategorie: " + restaurant.kategorie;

    card.appendChild(name);
    card.appendChild(addresse);
    card.appendChild(kategorie);

    resultDiv.appendChild(card);
}

function showMessage(message) {
    const card = document.createElement("div");
    card.classList.add("card");

    const msg = document.createElement("p");
    msg.textContent = message;

    card.appendChild(msg);

    resultDiv.appendChild(card);
}

showAllBtn.addEventListener('click', () => {
    // TODO: 
    // fetch data from backend
    // check response + display message / cards
});

showForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    // TODO: 
    // fetch data from backend
    // check response + display message / cards
});


deleteForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    // TODO: 
    // fetch data from backend
    // check response + display message / cards
});

addForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    // TODO: 
    // fetch data from backend
    // check response + display message / cards
});

updateForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    // TODO: 
    // fetch data from backend
    // check response + display message / cards
});
