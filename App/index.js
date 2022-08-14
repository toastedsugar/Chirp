// Dependencies here
const express = require('express');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');

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
    res.send("HELLO");
    //res.render("home");
});

/***************************************************
Run application */
const port = 5000
app.listen(port, () => {
    console.log("Listening on port ", port);
});




