//creating constants of required modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
 Creating schema's for data
*/
//User schema
const User = mongoose.model('User', {
  fullname: String,
  email: String,
  password: String
})

//app routings
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

  const user = new User({
    fullname: fullname,
    email: email,
    password: password
  })

  user.save().then(() => console.log('successfully signed up'));

  res.redirect("/");
})

//app server port setup
app.listen(3000, function() {
  console.log("Server started on 3000 port");
})
