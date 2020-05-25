const mongoose = require('mongoose');
var passport_local_mongoose = require('passport-local-mongoose');

user_schema = new mongoose.Schema({
    username: String,
    password: String
});

user_schema.plugin(passport_local_mongoose);
module.exports = mongoose.model("user", user_schema);