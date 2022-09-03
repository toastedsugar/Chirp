// Dependencies here
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
//const passport = require('passport');
const LocalStrategy = require('passport-local')

const Profile = require('./Models/Profile/ProfileModel.js');
const AppError = require('./Utils/Middleware/AppError');
const wrapAsync = require('./Utils/Middleware/wrapAsync');
const useFlashes = require('./Utils/Middleware/useFlashes');
const passport = require('passport');

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

// Enable session
sessionOptions = {
    secret: "Verry-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7,
    }
}
app.use(cookieParser())
app.use(session(sessionOptions))

app.use(flash())
app.use(useFlashes)

// Configure passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(Profile.authenticate()))
passport.serializeUser(Profile.serializeUser())
passport.deserializeUser(Profile.deserializeUser())

// Set the bootstrap javascript in node_modules as a static directory
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(morgan('dev'));        // Activate logger


/***************************************************
****************************************************
****************************************************
****************************************************
GET Request for homepage */
app.get("/", (req, res) => {
    //res.send("HELLO");
    res.render("home");
});

/***************************************************
GET request to view one user's profile */
app.get("/profiles/:username", wrapAsync(async(req, res, next) => {
    const profile = await Profile.findOne({username: req.params.username})
    //console.log('feadsfefdas')
    //console.log(profile)
    if(!profile){
        throw new AppError('Profile not found', 404)
    }
    res.render('Profile/view', {profile});
}));

/***************************************************
GET Request for List of all users */
app.get("/profiles", wrapAsync(async(req, res, next) => {
    //res.send("HELLO");
    const profiles = await Profile.find({})
    if(!profiles){
        throw new AppError('Profiles not found', 404)
    }
    res.render("Profile/index", {profiles});
}));

/***************************************************
GET Request 
View the registration page*/
app.get('/register', (req, res) => {
    res.render('Profile/register');
});

/***************************************************
Post Request 
Register new user data*/
app.post('/register', wrapAsync(async (req, res, next) => {
    try{
        const newProfile = new Profile(req.body.user)
        const registration = await Profile.register(newProfile, req.body.password)
        req.flash('success', `${newProfile.username} has been registered`)
        res.redirect('/profiles')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}));

/***************************************************
GET Request 
View the login page*/
app.get('/login', (req, res) => {
    res.render('Profile/login');
});

/***************************************************
POST Request 
Submit login information*/
app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(async (req, res, next) => {
    req.flash('success', `Welcome back, ${req.body.username}`)
    res.redirect('/profiles')
}));

/***************************************************
GET Request 
Update a user's profile*/
app.get('/profiles/update/:username', wrapAsync(async (req, res, next) => {
    const profile = await Profile.findOne({username: req.params.username})
    if(!profile){
        throw new AppError('Profile not found', 404)
    }
    res.render('Profile/update', {profile});
}));

/***************************************************
PATCH Request 
Update a user's profile*/
app.patch('/profiles/:username', wrapAsync(async (req, res, next) => {
        const {username} = req.params
        const update = await Profile.updateOne({username: username}, req.body.user)
        if(!update){
            throw new AppError('Product not found', 404)
        }
        const profile = await Profile.findOne({username: username})
  
        req.flash('success', 'Updated profile information')
        res.redirect(`/profiles/${username}`);
}))

app.delete('/profiles/:username', wrapAsync(async (req, res, next) => {
        //console.log('Deleting')
        const {username} = req.params
        const deleted = await Profile.deleteOne({username: username})
        if(!deleted){
            throw new AppError('Product not found', 404)
        }
        req.flash('success', `${username} has been terminated`)
        //console.log(res.flash)
        res.redirect('/profiles')
}));

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




