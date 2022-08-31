const Schema = mongoose.Schema;

// username and password
const chirpSchema = new Schema({
    userID:             {type: String},
    body:               {type: String},
    viewCount:          {type: Number},
    likeCount:          {type: Number},
    reportCount:        {type: Number},
    rechripCount:       {type: Number},
    comments:           [
                            {type: Chirp}
                        ],
    creationDate:      {type: Number},
})

module.exports = mongoose.model('Chirp', chirpSchema)