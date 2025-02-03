const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'ventes';
let db;

async function connect() {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log("Connecté à MongoDB");
}

function getDb() {
    if (!db) {
        throw new Error("La base de données n'est pas initialisée");
    }
    return db;
}

module.exports = { connect, getDb };