const express = require('express');
const campground = require('../models/campground');
const comment = require('../models/comment');
// use this to more easily define our routes
var router = express.Router();

// require the middleware file
var middleware = require('../middleware');

// INDEX - show all campgrounds
router.get("/campgrounds", (req,res) => {
    // console.log(req.user.username);
    // console.log(req.body);
    // get all campgrounds from DB, then render the file
    campground.find({},(err, all_campgrounds) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("campground/index", {campgrounds: all_campgrounds, page: 'campgrounds'});
        }
    });
    
});

// CREATE - add new campground to DB 
router.post("/campgrounds", middleware.isLoggedIn, (req,res) => {
    // get data from form and create new object
    var campground_author = {
        id: req.user._id,
        username: req.user.username
    };
    var new_campground = {name: req.body.name, image: req.body.image, desc: req.body.desc, author: campground_author, price: req.body.price};
    // save new object to DB
    campground.create(new_campground, (err, campground) => {
        if(err){
            console.log(err);
            console.log('the post fucked up');
        }
        else{
            // redirect back to campgrounds page 
            // yes we have 2 /campgrounds, the redirect function defaults to GET
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req,res) => {
    res.render("campground/new");
})

// SHOW - shows more info about a single campground
router.get("/campgrounds/:id", (req,res) => {
    //find the campground with the provided id, 
    campground.findById(req.params.id).populate('comments').exec((err, found_campground) => {
        if(err){
            console.log(err);
        }
        else{
            // render the template
            // console.log(found_campground.author.username);
            // console.log(req.user.username);
            res.render("campground/show", {campground: found_campground, req: req});
        }
    });
});

// EDIT - used to edit a specific campground
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, (req,res) => {
    campground.findById(req.params.id, (err,found_campground)=>{
        if(err){
            req.flash('error','That campground was not found');
        }
        res.render("campground/edit", {campground: found_campground});
    });
});

// UPDATE - used to update a specific campground
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, (req,res)=>{
    // find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updated_campground)=>{
        if(err){
            console.log(err);
            req.flash('error','Could Not Update Campground');
        }
        else{
            // redirect to the show page
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY - deletes a specific campground
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, (req,res)=>{
    campground.findByIdAndRemove(req.params.id, (err,removed_campground)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }
        else{
            // delete all assoiated comments
            comment.deleteMany({_id: { $in: removed_campground.comments}},(err)=>{
                res.redirect('/campgrounds');
            });
        }
    });
});

// were exporting the router varible to app.js
module.exports = router;