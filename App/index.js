// Dependencies here
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');

const User = require('./Models/User/User.js');
const { update, updateOne, findOneAndUpdate } = require('./Models/User/User.js');

//Connect to database
mongoose.connect("mongodb://localhost:27017/Chirp", {
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
GET request to view one user's profile */
app.get("/users/:userName", async(req, res) => {
    const oneUser = await User.findOne({userName: req.params.userName})
    //console.log(oneUser)
    res.render('Users/user', {oneUser});
});

/***************************************************
GET Request for List of all users */
app.get("/users", async(req, res) => {
    //res.send("HELLO");
    const allUsers = await User.find({})
    res.render("Users/userIndex", {allUsers});
});

/***************************************************
GET Request 
View the new user creation page*/
app.get('/register', (req, res) => {
    res.render('Users/createUser');
});

/***************************************************
Post Request 
Submit new user data*/
app.post('/register', async (req, res) => {
    //console.log(req.body.user)
    const newUser = new User(req.body.user)
    await newUser.save()
    //res.send(newUser)
    res.redirect('/users')
});

/***************************************************
GET Request 
Update a user's profile*/
app.get('/users/updateUser/:userName', async (req, res) => {
    const oneUser = await User.findOne({userName: req.params.userName})
    res.render('Users/updateUser', {oneUser});
})

/***************************************************
PATCH Request 
Update a user's profile*/
app.patch('/users/updateUser/:username', async (req, res) => {
    /*
    //console.log(req.body.user)
    const {username} = req.params
    console.log(req.body.user)
    const update = await User.findOneAndUpdate({userName: username}, req.body.user) 
    //console.log(update)
    res.send(update)
    //res.redirect('/users/' + username)
    */
    const {username} = req.params
    //const user = await User.findOne({userName: username})
    //const savedUser = await user.save()
    //const user = await updateOne({userName: username}, req.body.user)
    //const user = await findOneAndUpdate({userName: username}, req.body.user, {new: true})
    //console.log(user)
    //const user = await User.findOne({userName: username})
    const update = await User.updateOne({userName: username}, req.body.user)
    console.log(update)
    //res.redirect('/users')
    //res.redirect('/users/' + username)

    const oneUser = await User.findOne({userName: req.body.user.userName})
    console.log(oneUser)
    res.render('Users/user', {oneUser});
})





/***************************************************
Run application */
const port = 5000
app.listen(port, () => {
    console.log("Listening on port ", port);
});




