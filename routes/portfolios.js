var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolio");
var middleware = require("../middleware")

// INDEX:Show all Portfolios
router.get("/portfolios", function(req, res){
    //console.log(req.user);
    //Get all Portfolios from Database
    Portfolio.find({}, function(err, allPortfolios){
        if(err){
            console.log(err)
        }else{
            console.log(allPortfolios)
            res.render("portfolios/index", {portfoliosVar : allPortfolios, currentUser :req.user});
        }
    })
        
});

//CREATE: Add new Portfio to DB
router.post("/portfolios",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var link = req.body.link;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    //console.log(author);
    var newPortfolio = {name : name, image : image, link:link, author:author};
    //console.log(newPortfolio);
    //Create a new Portfolio and save to DB
    Portfolio.create(newPortfolio, function(err, newlyCreated){
        //console.log(newlyCreated)
        if(err){
            console.log(err);
        }else{
            //redirect to portfolio page
            //console.log(newlyCreated)
            req.flash("success", "Portfolio added successfully");
            res.redirect("/portfolios")
        }
    })
});

//NEW: Show form to create new portfolio
router.get("/portfolios/new",middleware.isLoggedIn, function(req, res) {
    res.render("portfolios/new");
});

//show more info on each portfolio site
router.get("/portfolios/:id", function(req, res) {
    //find the campground with the provided ID
    Portfolio.findById(req.params.id).populate("comments").exec(function(err, foundPortfolio){
        if(err){
            console.log(err);
        }else{
            //render show template with that campground
            //console.log(foundPortfolio);
            res.render("portfolios/show", {portfoliosVar : foundPortfolio})
        }
    })
});

//EDIT ROUTE
router.get("/portfolios/:id/edit",middleware.checkPortfolioOwnership, function(req, res) {
        Portfolio.findById(req.params.id, function(err, foundPortfolio){
        //console.log(foundPortfolio)
            res.render("portfolios/edit", {portfoliosVar : foundPortfolio});
    })
   
    
    //otherwise redirect
    //if not redirect
    
    
})
//UPDATE ROUTE
router.put("/portfolios/:id",middleware.checkPortfolioOwnership, function(req, res) {
    //find and update correct portfolio
    Portfolio.findByIdAndUpdate(req.params.id, req.body.portfolio, function(err, updatedPortfolio){
      if(err){
         res.redirect("/portfolios"); 
      }else{
          res.redirect("/portfolios/"+ req.params.id);
      }
    })
});

//DESTROY PORTFOLIO ROUTE
router.delete("/portfolios/:id",middleware.checkPortfolioOwnership, function(req, res){
    Portfolio.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/portfolios");
        }else{
            req.flash("success", "Portfolio deleted successfully")
            res.redirect("/portfolios");
        }
    })
});


module.exports = router;