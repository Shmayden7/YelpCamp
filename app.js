//=============================
// REQUIRE INSTALLED PACKAGES
const  express         = require("express"),
       app             = express(),
       mongoose        = require("mongoose"),
       body_parser     = require("body-parser"),
       passport        = require('passport'),
       local_strategy  = require('passport-local'),
       method_override = require('method-override'),
       flash           = require('connect-flash');
//=============================

//=============================
// REQUIRE THE SCHEMAS WE SETUP
const seedDB       = require("./seedDB"),
      campground   = require("./models/campground"),
      comment      = require("./models/comment"),
      user         = require("./models/user");
//=============================

//=============================
// REQUIRE ROUTE FILES
const campground_routes = require('./routes/campgrounds'),
      comment_routes    = require('./routes/comments'),
      auth_routes       = require('./routes/index');
//=============================

// CONNECTING THE DATABASE
mongoose.connect("mongodb+srv://Shmayden7:1760Ayden.@cluster0-edxa9.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, 
useUnifiedTopology: true, useCreateIndex: true}).then(() => {
    console.log('D.B. Connected!');
}).catch(err => {
    console.log('ERROR:', err.message);
});

app.use(body_parser.urlencoded({extended: true}));
// this will make you not have to type .ejs
app.set("view engine", "ejs");
// including the 'public' directory, __dirname is the directory that app.js is in
app.use(express.static(__dirname + "/public"));
// setup method override
app.use(method_override('_method'));
// getting express to use flash
app.use(flash());

//seedDB(); // Fill the DB with Dummy Data

//=============================
// PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'YelpCamp is awesome',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_strategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//=============================

//=============================
// PASSING VAR CURRENT_USER INTO EVERY ROUTE
app.use(function(req,res,next){
    res.locals.current_user = req.user;
    next();
});
//=============================

//=============================
// PASSING VAR MESSAGE INTO EVERY ROUTE
app.use(function(req,res,next){
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
//=============================

//=============================
// USING OUR ROUTING DECLORATIONS
app.use(campground_routes);
app.use(comment_routes);
app.use(auth_routes);
//=============================

app.listen(1000, () => {
    console.log("Yelp Camp has started! port 1000")
});