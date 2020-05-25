const express = require('express'),
      passport = require('passport'),
      user     = require('../models/user');
// use this to more easily define our routes
var router = express.Router();

//=============================
router.get("/", (req,res) => {
    res.render("landing")
});
// ===========================================

// ===========================================
// AUTHENTICATION ROUTES
// show the register form
router.get("/register",(req,res) => {
    res.render("register", {page: 'register'});
});
// REGISTER
router.post('/register',(req,res) => {
    var new_user = ({username: req.body.username});
    user.register(new_user, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate('local')(req,res, function(){
            req.flash('success','Welcome to YelpCamp '+user.username);
            res.redirect('/campgrounds');
        });
    });
});

// LOGIN
router.get('/login', (req,res) => {
    res.render('login', {page: 'login'});
});

router.post('/login', passport.authenticate("local", 
{
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req,res){
    if(err){
        console.log(err);
    }
});

// LOGOUT
router.get("/logout", (req,res) => {
    req.logout();
    req.flash('success','Logged you out!');
    res.redirect('/campgrounds');
});

// ===========================================

module.exports = router;