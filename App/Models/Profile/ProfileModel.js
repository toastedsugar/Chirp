const{string, required} = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

// username and password
const profileSchema = new Schema({
    displayName:    {type: String},
    firstName:      {type: String},
    lastName:       {type: String},
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

profileSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Profile', profileSchema)