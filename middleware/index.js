const campground = require('../models/campground');
const comment = require('../models/comment');
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, (err, found_campground) => {
            if(err){
                request.flash('error', 'Campground not found');
                res.redirect('/campgrounds')
            }
            else{
                //does the user own the campground?
                if(req.user && found_campground.author.username === String(req.user.username)){
                    next();               
                }
                else{
                    req.flash('error',"You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }
    else{
        request.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    } 
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        // console.log(req.params.comment_id);
        comment.findById(req.params.comment_id, (err, found_comment) => {
            if(err){
                console.log(err);
                res.redirect('back')
            }
            else{
                //does the user own the comment?
                if(req.user && found_comment.author.username === String(req.user.username)){
                    next();               
                }
                else{
                    req.flash("error','You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error','You need to be logged in to do that');
        res.redirect('back');
    } 
};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
};

module.exports = middlewareObj;