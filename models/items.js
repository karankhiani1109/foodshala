var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  itemname: String,
  type:String,
  cusine : String,
  restaurant: Object,
  description:String,
  amount:Object,
});

module.exports = mongoose.model('items', taskSchema);
