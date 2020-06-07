var mongoose = require("mongoose");

//Schema
var portfolioSchema = new mongoose.Schema({
    name : String,
    image : String,
    link : String,
    author : {
        id :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    comments : [
            
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Comment"
            }
        ]
});

//Model
var Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
