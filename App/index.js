// Dependencies here
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');

//Connect to database
mongoose.connect("mongodb://localhost:27017/YelpCamp", {
    useNewURLParser: true,
    //createUserIndex: true,        // Not supported in mongoose?
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

// Initialize application
const app = express();


// Enable templating engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')

// Configure folders for files
app.set('views', path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'Public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/***************************************************
GET Request for homepage */
app.get("/", (req, res) => {
    //res.send("HELLO");
    res.render("home");
});

/***************************************************
GET Request for List of all users */
app.get("/userIndex", (req, res) => {
    //res.send("HELLO");
    res.render("Users/userIndex");
});

/***************************************************
GET Request for one user */
app.get("/userIndex", (req, res) => {
    //res.send("HELLO");
    res.render("Users/:username");
});



/***************************************************
Run application */
const port = 5000
app.listen(port, () => {
    console.log("Listening on port ", port);
});




