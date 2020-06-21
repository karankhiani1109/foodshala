var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var createError = require('http-errors');

const MongoClient = require( 'mongodb' ).MongoClient;
var passport = require('passport');
var session = require('express-session');

var cookieSession = require('cookie-session')
require('./passport');
var authRoute = require('./routes/auth');
var pagesRoute = require('./routes/pages')
global.User = require('./models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
app.use(session({
  cookieName: 'session',
   secret: 'anything',
  resave:false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.locals.user = req.user;
//     console.log(res.locals.user);
//   }
//   next();
// });

app.use('/', authRoute);
app.use('/', pagesRoute);
app.get('/hello',
  function(req, res) {
    console.log(req.user);
    res.render('index', { user: req.user });
  });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
