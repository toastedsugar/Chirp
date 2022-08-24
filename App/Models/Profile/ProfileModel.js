const{string, required} = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    firstName:      {type: String},
    lastName:       {type: String},
    displayName:    {type: String},
    userName:       {type: String},
    password:       {type: String},
    description:    {type: String},
    profilePicture: {type: String},
    chirpCount:     {type: Number},
    followingCount: {type: Number},
    followerCount:  {type: Number},
    city:           {type: String},
    state:          {type: String},
    country:        {type: String},
    birthYear:      {
                        type: Number,
                        default: 2000
                    },
    birthMonth:     {
                        type: Number,
                        default: 1
                    },
    birthDay:       {
                        type: Number,
                        default: 1
                    },
})

module.exports = mongoose.model('Profile', profileSchema)