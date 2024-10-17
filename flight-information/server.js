const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const PORT = 3002;
app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/flightdb').then
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

app.get('/flights', async(req,res)=>{
    const flights = await Flight.find();
    res.json(flights);
});

app.get('/flights/:id', async(req,res)=>{
    const flight = await Flight.findById(req.params.id);
    res.json(flight)
});

app.post('/flight', async(req,res)=>{
    const flight = new Flight(req.body);
    await flight.save();
    res.json(flight);
});

app.get('/flight/passengers/:flightid', async(req,res)=>{
    const flightid = req.params.flightid;
    const passengers = await axios.get(`http://passenger-information:3003/passengers/flight/${flightid}`);
    res.json(passengers.data);

});

app.get('/flight/airlines/:airlineid', async(req, res)=>{
    const airlineid = req.params.airlineid;
    const flights = await Flight.find({airlineid: airlineid});
    res.json(flights);
});

app.listen(PORT,()=>{
    console.log(`Flight service running on port ${PORT}`);
});
