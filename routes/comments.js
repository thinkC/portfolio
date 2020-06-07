var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolio");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//======================
//COMMENT ROUTE
//======================

//COMMENT NEW
router.get("/portfolios/:id/comments/new",middleware.isLoggedIn, function(req, res) {
    //find Portfolio by Id
    Portfolio.findById(req.params.id, function(err, portfolio){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {portfoliosVar : portfolio});
        }
    })
});

//Create Post Route where form is submitted to
router.post("/portfolios/:id/comments",middleware.isLoggedIn, function(req, res){
    Portfolio.findById(req.params.id, function(err, portfolio){
        if(err){
            console.log(err);
            res.redirect("/portfolios");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //console.log("New Comment username will be " + req.user.username)
                    //save comment
                    comment.save();
                    portfolio.comments.push(comment);
                    portfolio.save();
                    //console.log(comment)
                    req.flash("success", "comment added successfully")
                    res.redirect("/portfolios/" + portfolio._id);
                }
            })
        }
    })
});

//COMMENT EDIT ROUTE
router.get("/portfolios/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err,foundComment) {
        console.log(foundComment)
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {portfoliosV_id: req.params.id, commentV: foundComment})
        }
    })
    
});

//COMMENT UPDATE ROUTE
router.put("/portfolios/:id/comments/:comment_id/",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/portfolios/" + req.params.id);
        }
    })
});

// COMMENT DESTROY ROUTE
router.delete("/portfolios/:id/comments/:comment_id/",middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "comment deleted")
           res.redirect("/portfolios/" + req.params.id);
       }
    });
});

//Middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// };

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment) {
//             if(err){
//                 res.redirect("back");
//             }else{
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next()
//                 }else{
//                     res.redirect("back")
//                 }
//             }
//         })
//     }else{
//         res.redirect("back");
//     }
    
// }


module.exports = router;