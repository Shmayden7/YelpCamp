const mongoose = require("mongoose");

var comment_schema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String,
    }
});

module.exports = mongoose.model("comment", comment_schema);