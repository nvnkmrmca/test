const express = require('express');
// const bodyParser = require('body-parser');
// var cors = require('cors');

// var path = require('path');

var app = express();
var port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))

// parse application/json
// app.use(bodyParser.json())
app.use(express.json())

// allow cross origin
// app.use(cors({credentials: true, origin: true}));

// configuring the database
// const dbConfig = require('./config/database.js');
// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// connecting to the database
// mongoose.connect(dbConfig.url, {
// 	useNewUrlParser: true
// }).then(() => {
//     console.log("Successfully connected to the database");    
// }).catch(err => {
//     console.log('Could not connect to the database. Exiting now...', err);
//     process.exit();
// });

// simple route
app.get('/', (req, res) => {
    // res.json({"message": "Welcome to andavar furniture and electronics."});
    // res.sendFile(path.join(__dirname + '/index.html'));
    res.sendFile('index.html', { root: '.' });
});
// require('./routes')(app);

// listen for requests
app.listen(port, () => {
    console.log("Test API Server is listening on port " + port);
});