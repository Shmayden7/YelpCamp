const express = require('express'),
      campground = require('../models/campground'),
      comment    = require('../models/comment');
// use this to more easily define our routes
var router = express.Router();

// require the middleware file
var middleware = require('../middleware');

// ===========================================
// COMMENTS ROUTES

// COMMENTS NEW
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req,res)=>{
    // find campground by ID
    campground.findById(req.params.id, (err,campground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comment/new", {campground: campground});
        }
    });
});

// COMMENTS CREATE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req,res)=>{
    //lookup using ID
    campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }
        else{
            // create new comment
            comment.create(req.body.comment, (err,comment)=>{
                if(err){
                    req.flash('error','Something went wrong');
                    console.log(err);
                }
                else{
                    // connect new comment to campground
                    // add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground showpage
                    req.flash('success','Added new comment');
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    }); 
});
// ===========================================

// COMMENTS EDIT ROUTE
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req,res)=>{
    comment.findById(req.params.comment_id, (err, found_comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            res.render('comment/edit', {campground_id: req.params.id, comment: found_comment });
        }
    });
});

// COMMENTS UPDATE ROUTE
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated_comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });
});

// COMMENTS DESTROY ROUTE
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req,res)=>{
    comment.findByIdAndRemove(req.params.comment_id, (err, deleted_comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            req.flash('success','Comment Deleted');
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

module.exports = router;