var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var nodemailer = require("nodemailer");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

//ABOUT
router.get("/about", function(req, res) {
    res.render("about");
});

//Contact
router.get("/contact", function(req, res) {
    res.render("contact");
});

router.post("/send", function(req, res) {
    //var msg = "mail sent"
    //res.redirect("contact", {msg :msg})
    var name = req.body.name;
    var company = req.body.company;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;
    var output = {name : name, company:company, email:email,phone:phone,message:message}
    
    console.log(req.body)
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'gator4267.hostgator.com',
        //port: 587,
        port: 465,
        
        //secure: false, // true for 465, false for other ports
        secure: true,
        auth: {
            user: "info@triangulah.com", // generated ethereal user
            pass: "Jesus01234."  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"NodeMailer Contact" <info@triangulah.com>', // sender address
        to: 'tunde.oyewo@gmail.com, tunde_oyewo@yahoo.co.uk', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        //html: '<b>Hello world?</b>' // html body
        html: output
       
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
         res.render("contact", {output : output, msg : "Message sent"})
    });
})

//================
//AUTHENTICATION
//================

//Show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
           console.log(err);
           req.flash("error", err.message)
           return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome "+ user.username)
            res.redirect("/portfolios");
        })
    })
});

//Login Route
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login Logic
router.post("/login",passport.authenticate("local",
{
    successRedirect : "/portfolios",
    failureRedirect : "/login"
}), function(req, res) {
    
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/portfolios");
});

// //middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;