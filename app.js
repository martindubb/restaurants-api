// import benoetigte module
const express = require('express');
const app = express();
const db = require('better-sqlite3')('restaurants.db');

// db verbindungs parameter
const port = 3000;
const hostname = 'localhost';

// db table creation string
db.prepare('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL ,addresse TEXT, kategorie TEXT)').run();

// bodyparser middleware aktivieren
app.use(express.json());

/* API ENDPUNKTE */

// alle restaurants abfragen
app.get('/restaurants', (_, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET all restaurants");
    
    // db abfrage alle restaurants
    let result = db.prepare('SELECT * FROM restaurants').all();
    res.send(result);
});

// bestimmtes restaurant abfragen
app.get('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET " + req.params.name);

    // db abfrage einzelnes restaurant
    let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(req.params.name);

    // gib ergebnis der suche zurück
    if (result === undefined) {
        res.status(404);
        res.send("dieses restaurant existiert nicht");
    } else {
        res.send(result);
    }
});

// neues restaurant hinzufügen
app.post('/restaurant', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " POST " + req.body.name);

    let r = req.body;
    // prüfe, ob alle erforderlichen daten vorhanden sind
    if (!r.name || !r.addresse || !r.kategorie) {
        res.status(400);
        res.send("objekt ist nicht vollständig! name, addresse oder kategorie fehlt!");
    } else {
        // prüfe, ob element bereits in datenbank
        let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(r.name);
        if (result === undefined) {
            // nicht vorhanden, füge restaurant hinzu
            db.prepare('INSERT INTO restaurants (name, addresse, kategorie) VALUES( ?, ?, ?)').run(r.name, r.addresse, r.kategorie);
            res.status(201);
            res.send("restaurant wurde hinzugefügt");
        } else {
            // restaurant bereits vorhanden
            res.status(409);
            res.send("restaurant ist bereits gespeichert!");
        }
    }
});

// bestimmtes restaurant aktualisieren
app.put('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " PUT " + req.params.name);

    // prüfe, ob restaurant in liste vorhanden ist
    let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(req.params.name);
    if (result === undefined) { 
        // restaurant existiert nicht
        res.status(404);
        res.send("Restaurant nicht gefunden.")
    } else { 
        // restaurant existent
        const r = req.body;
        if (r.name && r.addresse && r.kategorie) {
            // ersetze alt durch neu
            db.prepare('UPDATE restaurants SET name = ?, addresse = ?, kategorie = ? WHERE name = ?').run(r.name, r.addresse, r.kategorie, r.name);
            // neues restaurant zurückgeben
            res.send(r);
            console.log(`Aktualisiere: ${req.params.name}: ${r.name}, ${r.addresse}, ${r.kategorie}.`);
        } else {
            res.status(400);
            res.send("Daten unvollständig, nicht aktualisiert.");
        }
    }
});

// bestimmtes restaurant loeschen
app.delete('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " DELETE " + req.params.name);

    // prüfe, ob element in datenbank
    let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(req.params.name);
    if (result === undefined) {
        res.status(404);
        res.send("Restaurant ist nicht vorhanden.");
    } else {
        // loesche restaurant
        db.prepare('DELETE FROM restaurants WHERE name = ?').run(req.params.name);
        res.send("Folgendes Restaurant wurde gelöscht: " + JSON.stringify(result));
    }
});

// server starten
app.listen(port, hostname, () => {
    console.log(`Server gestartet ${hostname}:${port}.`);
});
