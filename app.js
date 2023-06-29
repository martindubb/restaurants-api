const express = require('express');
const app = express();

// connection details
const port = 3000;
const hostname = 'localhost';

// bodyparser middleware aktivieren
app.use(express.json());

// globales restaurants array, inkl. initialem eintrag
let restaurants = [{ name: "Bobs Burgers", adresse: "Zum Burgerladen 3, 12345 Burgerhausen", kategorie: "burgerrestaurant" }];

// true/false, ob restaurant mit name schon vorhanden ist
function exists(name) {
    let result = restaurants.find((elem) => {
        if (elem.name == name) {
            return true;
        }
    });

    if (result) {
        return true;
    } else {
        return false;
    }

    // return result != undefined;
};

// gibt index eines bestimmten restaurants zurück; -1 falls es nicht existiert
function getIndex(name) {
    let index = -1;
    for (let i = 0; i < restaurants.length; i++) {
        if (restaurants[i].name == name) {
            index = i;
        }
    }
    return index;
}

// löscht ein restaurant aus dem globalen array
function delRestaurant(name) {
    const index = getIndex(name);
    let deleted = restaurants.splice(index, 1);
    return deleted;
}


/* API ENDPUNKTE */
// alle restaurants abfragen
app.get('/restaurants', (_, res) => {
    res.send(restaurants);
});

// bestimmtes restaurant abfragen
app.get('/restaurant/:name', (req, res) => {
    // variable fuer suchergebnis anlegen (undefined)
    let result;
    // suche nach restaurant in liste
    restaurants.forEach((elem) => {
        if (elem.name === req.params.name) {
            // wenn element in liste gefunden, speichere in variable restaurant
            result = elem;
        }
    });
    // gib ergebnis der suche zurück
    if (result) {
        res.send(result);
    } else {
        res.status(404);
        res.send("dieses restaurant existiert nicht");
    }
});

// neues restaurant hinzufügen
app.post('/restaurant', (req, res) => {
    let r = req.body;
    // prüfe, ob alle erforderlichen daten vorhanden sind
    if (!r.name || !r.adresse || !r.kategorie) {
        res.status(400);
        res.send("objekt ist nicht vollständig! name, adresse oder kategorie fehlt!");
    } else {
        // prüfe, ob element bereits in liste
        let e = exists(r.name);
        if (!e) {
            // nicht vorhanden, füge element hinzu
            restaurants.push(r);
            res.status(201);
            res.send("restaurant wurde hinzugefügt");
        } else {
            // element bereits vorhanden
            res.status(409);
            res.send("restaurant ist bereits gespeichert!");
        }
    }
});

// bestimmtes restaurant aktualisieren
app.put('/restaurant/:name', (req, res) => {
    // prüfe, ob restaurant in liste vorhanden ist
    let i = getIndex(req.params.name);
    if (i != -1) {
        const r = req.body;
        if (r.name && r.adresse && r.kategorie) {
            // ersetze alt durch neu
            restaurants[i] = r;
            // neues Restaurant zurückgeben
            res.send(r);
            console.log(`Aktualisiere: ${req.params.name}: ${r.name}, ${r.adresse}, ${r.kategorie}.`);
        } else {
            res.status(400);
            res.send("Daten unvollständig, nicht aktualisiert.");
        }
    } else { // restaurant nicht existent
        res.status(404);
        res.send("Restaurant nicht gefunden.")
    }
});

// bestimmtes restaurant löschen
app.delete('/restaurant/:name', (req, res) => {
    if (getIndex(req.params.name) != -1) {
        let del = delRestaurant(req.params.name);
        res.send("Folgendes Restaurant wurde gelöscht: " + JSON.stringify(del));
    } else {
        res.status(404);
        res.send("Restaurant ist nicht vorhanden.");
    }
});

// server starten
app.listen(port, hostname, () => {
    console.log(`Server gestartet ${hostname}:${port}.`);
});
