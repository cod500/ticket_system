const express = require('express');
const ejs = require('ejs');
const path = require('path');
const { Pool, Client } = require('pg');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const passport = require('passport');

// routes
const homeRoute = require('./routes/index');
const ticketRoute = require('./routes/tickets');
const userRoute = require('./routes/users');
const notificationRoute = require('./routes/notfications.js');

//init exprss app
const app = express();

//Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ejs middleware
app.set('view engine', 'ejs');

//express-session middleware
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: '218121!KGKBTMTM',
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);

//Passport middleware
require("../auth/passport")(passport);

app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());

//flash middleware
app.use(flash());

//cookie-parser middleware
app.use(cookieParser());

//Static files in public folder
app.use(express.static('public'));

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));

//Global variables
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

//routes
app.use(homeRoute);
app.use(ticketRoute);
app.use(notificationRoute);
app.use(userRoute);

app.get('*', (req, res) => {
  res.redirect('/');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`)
});