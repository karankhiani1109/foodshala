var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoUtil = require( './lib/mongoUtil' );
var User=require('./models/user');

var Restaurant=require('./models/Restaurant');

var user1 = new User();
var restaurant=new Restaurant();
mongoUtil.connectToServer( function( err, client ) {
    if (err) console.log(err);
    // start the rest of your app here
    // var mongoUtil = require( 'mongoUtil' );
  var db = mongoUtil.getDb();
  
  passport.serializeUser(function (user, cb) {
    // console.log("serialize",user)
    cb(null, user);
  });
  
  passport.deserializeUser(function (user, cb) {
    // console.log("deseralize",user)
    var o_id = new ObjectId(user._id);
    var cl1=db.collection( user.type );
    // console.log("sdf",cl1.findOne({ _id : o_id}));
    cl1.findOne({ _id : o_id}, function (err, user) {
      if (err) { return cb(err);
      console.log(err); }
      // console.log(user)
      cb(err, user);
    })
  });

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
  function (req,username, password, cb) {
    // console.log(cl1.findOne({email: username}));
    // console.log(req.body.type);
    var cl1=db.collection( req.body.type );
    cl1.findOne({email: username}, function (err, user) {
      if (err) return cb(err);
      
      
      if (!user) {
        return cb(null, false, {
          message: 'Incorrect username or password'
        });
      }
      
      if (!user1.validPassword(password,user.salt,user.hash)) {
        return cb(null, false, {
          message: 'Incorrect username or password'
        });
      }
      console.log(user)
      return cb(null, user);
    })
  }
));


});
