//creating constants of required modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require(__dirname + '/models/user');
const md5 = require('md5');

//created app constant for express class
const app = express();

//Connect database using mongoose
//DBHOST is an env variable that contains the connection of Mongodb
//DBHOST should be defined in .env file of the root folder
mongoose.connect(process.env.DBHOST);

// Getting appname from env file and setting a constant variable
const appname = process.env.APPNAME;


/**
 extended app features with other modules
*/
//setting app's view engine to ejs
app.set('view engine', 'ejs');

//enable body-parser to get the submitted form data
app.use(bodyParser.urlencoded( {extended: true }));

//setting a static public directory using express
app.use(express.static(__dirname + '/public'))

/**
//app routings
*/
app.get("/", function(req, res){
  res.render("home", {pageTitle: appname});
});

app.get("/signup", function(req, res) {
  res.render("signup", {pageTitle: "Create an account | " + appname});
});

app.post("/signup", function(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let fullname = req.body.name;

  let error;

  if (!email) {
    error = "Email is required";
    res.render("signup", {pageTitle: "Create an account | " + appname, pageError: error});
  } else if (!password) {
    error = "Password is required";
    res.render("signup", {pageTitle: "Create an account | " + appname, pageError: error});
  } else if (!fullname) {
    error = "Full name is required";
    res.render("signup", {pageTitle: "Create an account | " + appname, pageError: error});
  } else {
    if (fullname.length >=3 && fullname.length <= 25) {

      if (password.length >=8 && password.length <= 50) {

        const user = new User({
          fullname: fullname,
          email: email,
          password: md5(password)
        })

        User.findOne({email:email}, function(err, found) {
          if (err) {
            return handleError(err);
            // user.save().then(() => console.log('successfully signed up'));
            // res.render("home", {pageTitle: appname, pageSuccess: "Signed up! now you can login."});
          }
          if (found) {
            res.render("signup", {pageTitle: "Create an account | " + appname, pageError: "Email already exist"});
          } else {
            user.save().then(() => console.log('successfully signed up'));
            res.render("home", {pageTitle: appname, pageSuccess: "Signed up! now you can login."});
          }
        })


      } else {
        error = 'Password should be between 8 to 50 characters.';
        res.render("signup", {pageTitle: "Create an account | " + appname, pageError: error});
      }

    } else {
      error = 'Name should be between 3 to 25 characters.';
      res.render("signup", {pageTitle: "Create an account | " + appname, pageError: error});
    }


  }

});

//app server port setup
app.listen(3000, function() {
  console.log("Server started on 3000 port");
})
