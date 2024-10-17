const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3003;

app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/passengerdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const passengerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    flightid: String
});
const Passenger = mongoose.model('Passenger', passengerSchema);

app.get('/passengers', async (req, res) => {
    try {
        const passengers = await Passenger.find();
        res.json(passengers);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/passengers/:id', async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
            return res.status(404).json({ error: 'Passenger not found' });
        }
        res.json(passenger);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/passengers', async (req, res) => {
    try {
        const passenger = new Passenger(req.body);
        await passenger.save();
        res.status(201).json(passenger);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

app.get('/passengers/flight/:flightid', async (req, res) => {
    try {
        const passengers = await Passenger.find({ flightid: req.params.flightid });
        res.json(passengers);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Passenger service running on port ${PORT}`);
});
