var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  address: String,
  type: String,
  items:Object
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password,salt,hash) {
  var hash1 = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');

  return hash === hash1;
  // return true;
};
userSchema.methods.test = function(){
  console.log("test");

}

module.exports = mongoose.model('Restaurant', userSchema);
