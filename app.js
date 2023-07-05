// import benoetigte module
const express = require('express');
const app = express();
const db = require('better-sqlite3')('restaurants.db');

// http-server verbindungs parameter
const port = 3000;
const hostname = 'localhost';

// db table creation string
db.prepare('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL ,addresse TEXT, kategorie TEXT)').run();

// middleware aktivieren
app.use(express.json());
app.use(express.static(__dirname + '/assets'));

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
        res.send({"message": "Restaurant nicht gefunden!"});
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
        res.send({"message": "Objekt unvollständig: name, addresse oder kategorie fehlt!"});
    } else {
        // prüfe, ob element bereits in datenbank
        let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(r.name);
        if (result === undefined) {
            // nicht vorhanden, füge restaurant hinzu
            db.prepare('INSERT INTO restaurants (name, addresse, kategorie) VALUES( ?, ?, ?)').run(r.name, r.addresse, r.kategorie);
            res.status(201);
            res.send({"message": "Restaurant hinzugefügt: " + r.name});
        } else {
            // restaurant bereits vorhanden
            res.status(409);
            res.send({"message": "Restaurant bereits vorhanden: " + r.name});
        }
    }
});

// bestimmtes restaurant aktualisieren
app.put('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " PUT " + req.params.name);

    // prüfe, ob restaurant in db vorhanden
    let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(req.params.name);
    if (result === undefined) { 
        // restaurant existiert nicht
        res.status(404);
        res.send({"message": "Restaurant nicht gefunden!"});
    } else { 
        // restaurant existent
        const r = req.body;
        if (r.name && r.addresse && r.kategorie) {
            // ersetze alt durch neu
            db.prepare('UPDATE restaurants SET name = ?, addresse = ?, kategorie = ? WHERE name = ?').run(r.name, r.addresse, r.kategorie, req.params.name);
            // neues restaurant zurückgeben
            console.log(`Aktualisiere: ${req.params.name}: ${r.name}, ${r.addresse}, ${r.kategorie}.`);
            res.send({"message": "Restaurant aktualisiert: " + r.name});
        } else {
            res.status(400);
            res.send({"message": "Objekt unvollständig: name, addresse oder kategorie fehlt!"});
        }
    }
});

// bestimmtes restaurant loeschen
app.delete('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " DELETE " + req.params.name);

    // prüfe, ob restaurant in datenbank
    let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(req.params.name);
    if (result === undefined) {
        res.status(404);
        res.send({"message": "Restaurant nicht gefunden!"});
    } else {
        // loesche restaurant
        db.prepare('DELETE FROM restaurants WHERE name = ?').run(req.params.name);
        res.send({"message": "Restaurant gelöscht: " + req.params.name});
    }
});

// server starten
app.listen(port, hostname, () => {
    console.log(`Server gestartet ${hostname}:${port}.`);
});

// verbindung zur datenbank trennen
process.on('SIGINT', () => {
    db.close();
    console.log("verbindung zur datenbank getrennt.");
    process.exit();
});
