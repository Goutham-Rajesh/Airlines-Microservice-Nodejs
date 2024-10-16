const express = require('express');
const app = express();
const port = 3001;
const mysql = require('mysql2');
const axios = require('axios');

app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'pass@word1',
    database: 'airlinesdb'
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

function setupRoutes(){
    app.get('/airlines', (req, res) => {
        db.query('SELECT * FROM airlines', (err,results) => {
            if (err) {
                res.status(500).json({ error: 'Error fetching airlines data' });
            } else {
                res.json(results);
            }
        });
    });

    app.get('/airlines/:id', (req,res)=>{
        const airlineId = req.params.id;
        db.query('SELECT * FROM airlines WHERE id = ?', [airlineId], (err,results)=>{
            if(err){
                res.status(500).json({ error: 'Error fetching airline data' });
            } else if (results.length == 0){
                res.status(404).json({ error: 'Airline not found' });
            } else {
                res.json(results[0]);
            }
            
        })
    });


    app.post('/airlines', (req,res)=> {
        const { name, country} = req.body;
        db.query('INSERT INTO airlines (name, country) VALUES (?, ?)', [name, country], (err, results)=>{
            if(err){
                res.status(500).json({ error: 'Error creating airline' });
            }
            else{
                res.status(201).json({ message: 'Airline created successfully', id: results.insertId });}
            }
        );
    });    
}

setupRoutes();

app.listen(port, () => {
    console.log(`Airlines service running on port ${port}`);
});




