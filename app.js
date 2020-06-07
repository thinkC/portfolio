//22,23.Middleware, Flash Project_Editing Campgrounds
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Portfolio = require("./models/portfolio");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var seedDB = require("./seeds");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var nodemailer = require("nodemailer");


//requring routes
var commentRoutes = require("./routes/comments"),
    portfolioRoutes = require("./routes/portfolios"),
    indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blogs")

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost/aquarium";
mongoose.connect(url, { useMongoClient: true });

app.use(methodOverride("_method"));
app.use(flash());

//run everytime the server is started
//seedDB(); //see Database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// app.use("/", indexRoutes);
// app.use("/portfolios", campgroundRoutes);
// app.use("/portfolios/:id/comments", commentRoutes);

app.use(indexRoutes);
app.use(portfolioRoutes);
app.use(commentRoutes);
app.use(blogRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("Aquarium Porfolio Server started...");
});