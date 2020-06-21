var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoUtil = require( './../lib/mongoUtil' );
var User=require('./../models/user');
var Restaurant=require('./../models/Restaurant');
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);

var db = mongoUtil.getDb();
var cl1=db.collection( 'User' );
var cl2=db.collection( 'Restaurant' );

router.route('/login')
  .get(function(req, res, next) {
    
    res.render('login', { title: 'Login your account'});
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login'
  }), function (req, res,next) {
    // console.log(req.body);
    // return next()
    res.redirect('/');
  
  });

router.route('/register')
  .get(function(req, res, next) {
    res.render('register', { title: 'Register a new account'});
  })
  .post(function(req, res, next) {

    if(req.body.type=="customer"){
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password1', 'Empty Password').notEmpty();
    req.checkBody('password1', 'Password do not match').equals(req.body.confirmPassword1).notEmpty();

    // console.log(req.body);
    var errors = req.validationErrors();
    
    if (errors) {
      res.render('register', {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors
      });
    } else {
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password1);
      user.preference=req.body.preference;
      user.type="User";
    //   console.log(db.user)
    cl1.find({email: req.body.email }).toArray((err, result) => {
          if (err) {
                  res.render('register', {errorMessages: err});
                    } 
        if(result.length >0){
           res.render('register', {errorMessagesA: 'Email already Registered' });
        }             
        else  {
             cl1.insertOne(user, function(req, res, err) {
            if (err) {
                  res.render('register', {errorMessages: err});
                } else {
                  console.log("User Registered")
                }
            });
        res.render('register',{alertdata : "Customer Registered Succesfully"});
        }
        });
  
          
    }
   }
    else if(req.body.type=="restaurant"){
    req.checkBody('resname', 'Empty Name').notEmpty();

    req.checkBody('resaddress', 'Empty Address').notEmpty();
    req.checkBody('resemail', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Password').notEmpty();
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

    // console.log(req.body);
    var errors = req.validationErrors();
    
    if (errors) {
      res.render('register', {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors
      });
    } else {
      var restautant = new Restaurant();
      restautant.name = req.body.resname;
      restautant.email = req.body.resemail;
      restautant.setPassword(req.body.password);
      restautant.address=req.body.resaddress;
      restautant.type="Restaurant";
      restautant.items=[];
    //   console.log(db.user)
    cl2.find({email: req.body.email }).toArray((err, result) => {
          if (err) {
                  res.render('register', {errorMessages: err});
                    } 
        if(result.length >0){
           res.render('register', {errorMessagesA: 'Restaurent Email already Registered' });
        }             
        else  {
             cl2.insertOne(restautant, function(req, res, err) {
            if (err) {
                  res.render('register', {errorMessages: err});
                } else {
                  console.log("Restaurant Registered")
                }
            });
        res.render('register',{alertdata : "Restaurant Registered Succesfully"});
        }
        });
  
          
    }
   }


  });

  router.get('/login/current_user', function(req, res) {
    
    console.log(req.user);
    
    res.json(req.user );
  });


router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('login');
});

// router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

// router.get('/auth/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/',
//   failureRedirect: '/'
// }));

// console.log(db)

} );
// var d
module.exports = router;



