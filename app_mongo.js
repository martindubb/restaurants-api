// import benoetigte module
const mongodb = require("mongodb");
const express = require('express');
const app = express();

// http-server verbindungs parameter
const port = 3000;
const hostname = 'localhost';

// mongodb verbindung (user + password per umgebungsvariable)
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.arpywl2.mongodb.net/?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient(uri);
client.connect();
const db = client.db("database");
const coll = db.collection("restaurant");
db.command({ ping: 1 });
console.log("db connected")

// bodyparser middleware aktivieren
app.use(express.json());

/* API ENDPUNKTE */

// alle restaurants abfragen
app.get('/restaurants', async (_, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET all restaurants");

    // db abfrage alle restaurants
    let r = await coll.find().toArray();
    res.send(r);
});

// bestimmtes restaurant abfragen
app.get('/restaurant/:name', async (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET " + req.params.name);

    // db abfrage einzelnes restaurant
    let r = await coll.findOne({ name: req.params.name });
    
    // gib ergebnis der suche zurück
    if (r) {
        res.send(r);
    } else {
        res.status(404);
        res.send("dieses restaurant existiert nicht");
    }
});

// neues restaurant hinzufügen
app.post('/restaurant', async (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " POST " + req.body.name);

    let r = req.body;
    // prüfe, ob alle erforderlichen daten vorhanden sind
    if (!r.name || !r.adresse || !r.kategorie) {
        res.status(400);
        res.send("objekt ist nicht vollständig! name, adresse oder kategorie fehlt!");
    } else {
        // prüfe, ob restaurant bereits in datenbank
        let e = await coll.findOne({ name: r.name });
        if (e) {
            // restaurant bereits vorhanden
            res.status(409);
            res.send("restaurant ist bereits gespeichert!");
        } else {
            // nicht vorhanden, füge restaurant hinzu
            coll.insertOne(r);
            res.status(201);
            res.send("restaurant wurde hinzugefügt");
        }
    }
});

// bestimmtes restaurant aktualisieren
app.put('/restaurant/:name', async (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " PUT " + req.params.name);

    // prüfe, ob restaurant in db vorhanden
    let e = await coll.findOne({ name: req.params.name });
    if (e) {
        // restaurant existent
        const r = req.body;
        if (r.name && r.adresse && r.kategorie) {
            // ersetze alt durch neu
            let newdoc = await coll.findOneAndReplace({ name: r.name }, r, { returnNewDocument: true});
            // neues restaurant zurückgeben
            res.send(JSON.stringify(newdoc.value));
            console.log(`Aktualisiere: ${req.params.name}: ${JSON.stringify(newdoc.value)}.`);
        } else {
            res.status(400);
            res.send("Daten unvollständig, nicht aktualisiert.");
        }
    } else { 
        // restaurant nicht existent
        res.status(404);
        res.send("Restaurant nicht gefunden.")
    }
});

// bestimmtes restaurant löschen
app.delete('/restaurant/:name', async (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " DELETE " + req.params.name);

    // prüfe, ob restaurant in datenbank
    let e = await coll.findOne({ name: req.params.name });
    if (e) {
        // loesche restaurant
        let del = await coll.deleteOne({ name: req.params.name });
        if (del.acknowledged)
            res.send("Folgendes Restaurant wurde gelöscht: " + req.params.name);
        else 
            res.send("Fehler beim Löschen!");
    } else {
        res.status(404);
        res.send("Restaurant ist nicht vorhanden.");
    }
});

// server starten
app.listen(port, hostname, () => {
    console.log(`Server gestartet ${hostname}:${port}.`);
});

// verbindung zur datenbank trennen
process.on('SIGINT', () => {
    client.close();
    console.log("verbindung zur datenbank getrennt.");
    process.exit();
});
