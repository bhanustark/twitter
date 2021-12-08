//creating constants of required modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

//created app constant for express class
const app = express();

//extended app features with other modules
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( {extended: true }));
app.use(express.static(__dirname + '/public'))

//app routing
app.get("/", function(req, res){
  res.render("home");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

//app server port setup
app.listen(3000, function() {
  console.log("Server started on 3000 port");
})
