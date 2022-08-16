const{string, required} = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    displayName: String,
    userName: String,
    password: String,
    description: String,
    profilePicture: String,
    chirpCount: Number,
    followingCount: Number,
    followerCount: Number,
    locationCity: String,
    locationState: String,
    locationCountry: String,
    birthYear: Number,
    birthMonth: Number,
    birthDay: Number,
})

module.exports = mongoose.model("User", userSchema)