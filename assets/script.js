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
    // fetch data from backend
    fetch('/restaurants')
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        // check response + display cards
        resultDiv.innerHTML = "";
        result.forEach((obj) => {
            addCard(obj);
        });
    });
});

showForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    let n = document.getElementById("restaurantShowName").value;
    // fetch data from backend
    fetch('/restaurant/' + n)
    .then((response) => {
        if(response.status != 200) {
            new Error(response.json());
        } else {
            return response.json();
        }
    })
    .then((result) => {
        // check response + display cards
        resultDiv.innerHTML = "";
        addCard(result);
    })
    .catch((error) => {
        resultDiv.innerHTML = "";
        showMessage(error);    
    });
});

deleteForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    let n = document.getElementById("restaurantDeleteName").value;
    // fetch data from backend
    fetch('/restaurant/' + n, { method: 'DELETE' })
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        // check response + display cards
        resultDiv.innerHTML = "";
        showMessage(result.message);
    });
});

addForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    let name = document.getElementById("addName").value;
    let addresse = document.getElementById("addAdresse").value;
    let kategorie = document.getElementById("addKategorie").value;
    let data = JSON.stringify({ "name": name, "addresse": addresse, "kategorie": kategorie });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // fetch data from backend
    fetch('/restaurant', { method: 'POST', body: data, headers: myHeaders })
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        // check response + display cards
        resultDiv.innerHTML = "";
        showMessage(result.message);
    });
});

updateForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindere das automatische Absenden des Formulars
    let name_alt = document.getElementById("updateIdentifier").value;
    let name_neu = document.getElementById("updateName").value;
    let addresse = document.getElementById("updateAdresse").value;
    let kategorie = document.getElementById("updateKategorie").value;
    let data = JSON.stringify({ "name": name_neu, "addresse": addresse, "kategorie": kategorie });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // fetch data from backend
    fetch('/restaurant/' + name_alt, { method: 'PUT', body: data, headers: myHeaders })
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        // check response + display cards
        resultDiv.innerHTML = "";
        showMessage(result.message);
    });
});
