var mongoose = require("mongoose");
var Portfolio = require("./models/portfolio");
var Comment = require("./models/comment")

var data = [
        {
            name : "Tribute Page",
            image : "https://images.unsplash.com/photo-1496395650962-374cae58ca8b?dpr=1&auto=format&fit=crop&w=568&h=378&q=60&cs=tinysrgb",
            link : "https://thinkc.github.io/fcc/tributepage/"
        },
        
        {
            name : "Twitch TV",
            image : "https://images.unsplash.com/photo-1452451312475-5055e48f74cb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9%0A&s=b4707583cc984825e764be8fe877f3b9",
            link : "https://thinkc.github.io/fcc/twichtv1/"
        },
        
        {
            name : "Wikipedia Viewer",
            image : "https://images.unsplash.com/photo-1486229868416-95ac9da0a349?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9%0A&s=c18884a7ec2d559d2805518a139d7bfb",
            link : "https://thinkc.github.io/fcc/wikisearch/"
        },
        {
            name : "Calculator",
            image : "https://images.unsplash.com/photo-1494707924465-e1426acb48cb?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=ee4015ca6443db139e9b20fa5a247586",
            link : "https://thinkc.github.io/fcc/calculator/"
        }
        
    ]
//To remove Portfolios
function seedDB(){
    Portfolio.remove({}, function(err){
        if(err){
            console.log(err)
        }else{
            console.log("removed Portfolios!");
            // add Portfolios
            data.forEach(function(seed){
                Portfolio.create(seed, function(err, portfolioData){
                    //console.log(data)
                    if(err){
                        console.log(err)
                    }else{
                        console.log("added a Portfolio");
                        
                        // create comment
                        Comment.create({
                            text :"Nice Job",
                            author :" Tunde"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                              portfolioData.comments.push(comment);
                              portfolioData.save();
                              console.log("create new comment");
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = seedDB;