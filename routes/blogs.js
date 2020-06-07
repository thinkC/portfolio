var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolio");
var middleware = require("../middleware")

//blog
router.get("/blog", function(req,res){
    res.render("blogs/index");
   
})





module.exports = router;