// Dependencies here
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');
const morgan = require('morgan')

const Profile = require('./Models/Profile/ProfileModel.js');

const AppError = require('./Utils/AppError')

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
app.use(morgan('dev'));        // Activate logger

/***************************************************
GET Request for homepage */
app.get("/", (req, res) => {
    //res.send("HELLO");
    res.render("home");
});




/***************************************************
GET request to view one user's profile */
app.get("/profiles/:profileName", async(req, res) => {
    const profile = await Profile.findOne({profileName: req.params.profileName})
    //console.log(oneUser)
    res.render('Profile/view', {profile});
});

/***************************************************
GET Request for List of all users */
app.get("/profiles", async(req, res) => {
    //res.send("HELLO");
    const profiles = await Profile.find({})
    res.render("Profile/index", {profiles});
});

/***************************************************
GET Request 
View the new user creation page*/
app.get('/register', (req, res) => {
    res.render('Profile/create');
});

/***************************************************
Post Request 
Submit new user data*/
app.post('/register', async (req, res, next) => {
    try {
        //console.log(req.body.user)
        const newProfile = new Profile(req.body.user)
        if(!newProfile){
            throw new AppError('Product not found', 404)
        }
        await newProfile.save()
        //res.send(newUser)
        res.redirect('/profiles')
    }
    catch(e){
        next(e)
    }
});

/***************************************************
GET Request 
Update a user's profile*/
app.get('/profiles/update/:userName', async (req, res, next) => {
    try{
        const profile = await Profile.findOne({userName: req.params.userName})
        res.render('Profile/update', {profile});
    } catch(e){
        next(e)
    }
})

/***************************************************
PATCH Request 
Update a user's profile*/
app.patch('/profiles/:username', async (req, res, next) => {
    try{
        const {username} = req.params
        const update = await Profile.updateOne({userName: username}, req.body.user)
        if(!update){
            throw new AppError('Product not found', 404)
        }
        //console.log(update)
        const profile = await Profile.findOne({userName: req.body.user.userName})
        //console.log(oneUser)
        res.render('Profile/view', {profile});
    } catch(e){
        next(e)
    }
})

app.delete('/profiles/:username', async (req, res, next) => {
    try{
        //console.log('Deleting')
        const {username} = req.params
        const deleted = await Profile.deleteOne({userName: username})
        if(!deleted){
            throw new AppError('Product not found', 404)
        }
        res.redirect('/profiles')
    } catch(e){
        next(e)
    }
})

// Last resort error handler
app.use((err, req, res, next) =>{
    const{status = 500, message = 'Something went Wrong'} = err
    res.status(status).send(message)
})

/***************************************************
Run application */
const port = 5000
app.listen(port, () => {
    console.log("Listening on port ", port);
});




