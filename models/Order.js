var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  userdata: Object,
  restaurant:Object,
  item : Object,
  userid: String,
  restaurantid:String,
  itemname:String,
  itemdesc:String,
  restaurantname:String,
  custname:String,
  amount: String
});

module.exports = mongoose.model('Order', taskSchema);
