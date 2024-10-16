const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const PORT = 3002;
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/flightdb').then
    (console.log('connected to mongodb')).catch((err)=>console.log(err));

const flightSchema = new mongoose.Schema({
    flightNumber: String,
    departure: String,
    destination: String,
    departureTime: Date,
    arrivalTime: Date,
    availableSeats: Number,
    price: Number,
    airlineid: Number
});

const Flight = mongoose.model('Flight', flightSchema);

app.get('/flights', (req,res)=>{
    const flights = Flight.find();
    res.json(flights);
});

app.get('/flights/:id', (req,res)=>{
    const flight = Flight.findById(req.params.id);
    res.json(flight)
});

app.post('/flight', (req,res)=>{
    const flight = new Flight(req.body);
    flight.save();
    res.json(flight);
});

app.listen(PORT,()=>{
    console.log(`Flight service running on port ${PORT}`);
});
