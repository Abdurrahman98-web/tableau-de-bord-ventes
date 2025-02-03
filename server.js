const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Uygulamayı başlatma
const app = express();

// Middleware'ler
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Statik dosyaları sunma
app.use(express.static(__dirname + '/public'));

// MongoDB'ye bağlanma
mongoose.connect('mongodb://localhost:27017/ventes')
    .then(() => {
        console.log('Connecté à MongoDB');
    })
    .catch((err) => {
        console.error('Erreur de connexion à MongoDB', err);
    });

// Mongoose şeması ve modeli
const transactionSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    productQuantity: Number,
    totalAmount: Number
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Kök URL için rota
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// POST isteği ile veri ekleme
app.post('/api/transactions', (req, res) => {
    const { productName, productPrice, productQuantity, totalAmount } = req.body;

    const newTransaction = new Transaction({
        productName,
        productPrice,
        productQuantity,
        totalAmount
    });

    newTransaction.save()
        .then(() => res.status(200).json({ message: 'Transaction added successfully!' }))
        .catch(err => res.status(500).json({ message: 'Error adding transaction', error: err }));
});

// GET isteği ile verileri alma
app.get('/api/transactions', (req, res) => {
    Transaction.find()
        .then(transactions => res.status(200).json(transactions))
        .catch(err => res.status(500).json({ message: 'Error fetching transactions', error: err }));
});

// Sunucuyu başlatma
const PORT = process.env.PORT || 4009;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});