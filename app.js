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


app.get('/restaurants', (_, res) => {
    res.send(restaurants);
});

app.post('/restaurant', (req, res) => {
    let r = req.body;
    // prüfe, ob alle erforderlichen daten vorhanden sind
    if (!r.name || !r.adresse || !r.kategorie) {
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

app.listen(port, hostname, () => {
    console.log(`Server gestartet ${hostname}:${port}.`);
});
