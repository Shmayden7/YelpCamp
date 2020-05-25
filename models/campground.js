const mongoose = require("mongoose");
// SCHEMA SETUP
var campground_schema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    desc: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "comment"
        }
    ]
});
// CAMPGROUND DECLORATION
module.exports = mongoose.model("campground",campground_schema);