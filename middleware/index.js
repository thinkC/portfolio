
var Portfolio = require("../models/portfolio");
var Comment = require("../models/comment");

//All Middleware
var middlewareObj = {
    
    isLoggedIn : function(req, res, next){
        if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first")
    res.redirect("/login");
    },
    
    checkPortfolioOwnership : function(req, res, next){
        if(req.isAuthenticated()){
            Portfolio.findById(req.params.id, function(err, foundPortfolio){
            console.log(foundPortfolio)
        if(err){
            req.flash("error", "Portfolio not found")
            res.redirect("back");
        }else{
            //does user own the portfolio?
            if(foundPortfolio.author.id.equals(req.user._id)|| req.user._id == "5a464e6b2a315e09ea5a2873"){
                next();
            }else{
                req.flash("error", "You do not have permission");
                res.redirect("back");
            }
            
        }
    })
    }else{
        req.flash("error", "You need to be logged in first");
        res.redirect("back")
    }
    },
    
    checkCommentOwnership : function(req, res, next){
         if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                req.flash("error", "Comment not found")
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id) || req.user._id == "5a464e6b2a315e09ea5a2873"){
                    next()
                }else{
                    req.flash("error", "You do not have permission")
                    res.redirect("back")
                }
            }
        })
    }else{
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
    }
}

module.exports = middlewareObj