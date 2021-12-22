//creating constants of required modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");

const User = require('./models/user');

//created app constant for express class
const app = express();

/**
 extended app features with other modules
*/
//setting app's view engine to ejs
app.set('view engine', 'ejs');

//enable body-parser to get the submitted form data
app.use(bodyParser.urlencoded( {extended: true }));

//setting a static public directory using express
app.use(express.static(__dirname + '/public'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Connect database using mongoose
//DBHOST is an env variable that contains the connection of Mongodb
//DBHOST should be defined in .env file of the root folder
mongoose.connect(process.env.DBHOST);

// Getting appname from env file and setting a constant variable
const appname = process.env.APPNAME;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
//app routings
*/
app.get("/", function(req, res){

  if (req.isAuthenticated()) {
    res.render("index", {pageTitle: appname});
    console.log(req.user);
  } else {
    res.render("home", {pageTitle: appname});
  }
});

app.get("/signup", function(req, res) {
  res.render("signup", {pageTitle: "Create an account | " + appname});
});

app.post("/signup", function(req, res) {
  User.register({username: req.body.username}, req.body.password, function (err, user) {
    if (err) {
      //console.log(err);
      res.render("signup", {pageTitle: "Create an account | " + appname, pageError: err})
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/")
      })
    }

  })
});

app.post("/login", function(req,res) {
  const user = new User({
    username: req.body.username,
    password: req.body.passowrd
  });

  passport.authenticate("local", function (err, user, info) {
    if(err){
       console.log(err);
    } else {
      if (!user) {
        console.log("username or password is incorrect");
      } else {
        req.login(user, function(err){
          if (err) {
            console.log(err);
            res.redirect("/")
          } else {
            // passport.authenticate("local");
            res.redirect("/")
          }
        });
      }
    }
  })(req, res);

});

app.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/");
})

//app server port setup
app.listen(3000, function() {
  console.log("Server started on 3000 port");
})
