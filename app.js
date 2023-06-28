const express = require('express');
const app = express();

const port = 3000;
const hostname = 'localhost';

app.use(express.json());

let restaurants = [{ name: "Bobs Burgers", adresse: "Zum Burgerladen 3, 12345 Burgerhausen", kategorie: "burgerrestaurant"}];

const exists = (name) => {
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

function getIndex(name) {
    let index = -1;
    for (let i=0 ; i<restaurants.length ; i++) {
        if (restaurants[i].name == name) {
            index = i;
        }
    }
    return index;
}

function delRestaurant(name) {
    const index = getIndex(name);
    let deleted = restaurants.splice(index,1);
    return deleted;
}


app.get('/restaurants', (_, res) => {
    res.send(restaurants);
});

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
            // füge element hinzu
            restaurants.push(r);
            res.status(201);
            res.send("restaurant wurde hinzugefügt");
        } else {
            // element bereits vorhanden
            res.send("restaurant ist bereits gespeichert!");
        }
    }
});

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

// // * Restaurant aktualisieren mit Löschen
// app.put('/restaurant/:name', (req, res) => {
//     // prüfe, ob restaurant in liste vorhanden ist
//     if (getIndex(req.params.name) != -1) {
//         const r = req.body;
//         if (r.name && r.adresse && r.kategorie) {
//             // löschen & neu einfügen
//             delRestaurant(r.name);
//             restaurants.push(r);
//             // neues Restaurant zurückgeben
//             res.send(r); 
//             console.log(`Aktualisiere: ${req.params.name}: ${r.name}, ${r.adresse}, ${r.kategorie}.`);
//         } else {
//             res.status(400);
//             res.send("Daten unvollständig, nicht aktualisiert.");
//         }
//     } else { // restaurant nicht existent
//         res.status(404);
//         res.send("Restaurant nicht gefunden.")
//     }
// });

// * Restaurant aktualisieren mit Löschen
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

app.listen(port, hostname, () => {
    console.log(`Server gestartet ${hostname}:${port}.`);
});
