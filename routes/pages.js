var express = require('express');
var router = express.Router();
var menu=require('../data/northindian.json');
var snacks=require('../data/snacks.json');
var Restaurant=require('./../models/Restaurant');
var Items=require('./../models/items');
var Orders=require('./../models/Order');
var ObjectId = require('mongodb').ObjectID;
var BSON =require('bson');

// const JSON = require('circular-json');
var request = require('request');
/* GET home page. */
var mongoUtil = require( './../lib/mongoUtil' );
// var Task=require('./../models/task');
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  var db = mongoUtil.getDb();

  var cl2=db.collection( 'Restaurant' );

  var cl3=db.collection( 'Items' );
   var cl4=db.collection('Orders');

router.get('/', function(req, res, next) {
  // console.log("///",req.user);
  if(req.user && req.user.type=="Restaurant"){
    // console.log("userloginnm"+ req.user._id);
   
  res.redirect('addmenu');

   }
    else if(req.user && req.user.type=="User" ){
      res.redirect('displayitems');
    }
    else{
     res.redirect('displayitems'); 
    }
  
});

router.get('/addmenu', function(req, res, next) {
  if(req.user && req.user.type=="Restaurant")
  res.render('addmenu',{menu:menu,snacks:snacks,user:req.user});
  else
    res.redirect('/login')
});
router.post('/addmenu', function(req, res, next) {
   if(req.user && req.user.type=="Restaurant"){
    cl3.find({itemname:req.body.itemname}).toArray((err, result) => {
       if (err) return console.log(err);
       // console.log(result)
       if (result.length == 0){
         var items = new Items();
         // console.log(req.body);
         var restaurantdetails=JSON.parse(req.body.restaurant)
        items.itemname = req.body.itemname;
        items.type = req.body.type;
        items.cusine=req.body.cusine;
        items.description=req.body.description;
        items.restaurant=[]
        items.amount=[]
        items.restaurant.push(JSON.parse(req.body.restaurant));
        items.amount.push(req.body.amount)
        // console.log(items.id,req.body.restaurant);
        var o_id = new ObjectId(restaurantdetails._id);
        cl2.updateOne({_id: o_id},{$push :{items: items.id}}, function(err,res){
              if (err) throw err;
              console.log("Restaurant item added")
        });
     




        cl3.insertOne(items, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              
            });
        res.render('addmenu',{alertdata : "New Item added", user:req.user,menu:menu,snacks:snacks})
          }


          else{
            cl3.update({itemname: req.body.itemname},{$push :{restaurant: JSON.parse(req.body.restaurant),amount :req.body.amount}}, function(err,res){
             if (err) throw err;
            console.log("items updated");
          });
         var restaurantdetails=JSON.parse(req.body.restaurant);
         console.log(restaurantdetails);
            var o_id = new ObjectId(restaurantdetails._id);
            console.log(result[0]._id,result)
        cl2.updateOne({_id: o_id},{$push :{items: result[0]._id}}, function(err,res){
              if (err) throw err;
              console.log("item added Restaurant collection")
        });



        res.render('addmenu',{alertdata : "New Item added", user:req.user,menu:menu,snacks:snacks})
          }
        });

    }

});




router.route('/displayitems')
  .get(function(req, res, next) {
    var alertdata=""
      if(req.user && req.user.type == "User"){
        console.log("into",typeof(req.user._id))
        cl4.find({userid: String(req.user._id)}).toArray(function(err, resultx) {
       if (err) return console.log(err);
       if(resultx.length >0)
          alertdata=resultx.length + ' items in your order list'
      cl3.find().toArray(function(err, result) {
      if (err) return console.log(err);
       // console.log(result)
        console.log("heilo",alertdata)
        res.render('displayitems', {'result':result,'user': req.user,'alertdata':alertdata});
       
     });

     });
      }
      else if(req.user && req.user.type == "Restaurant"){
              res.redirect('/addmenu');
      }
      else{
             cl3.find().toArray(function(err, result) {
             if (err) return console.log(err);
             // console.log(result)
            
              res.render('displayitems', {'result':result,'user': req.user,'alertdata':alertdata});
             
     });
      }
     

   
  })
  .post(function(req, res, next) {
    
    var userdetails= JSON.parse(req.body.userdetails);
    var restaurant=JSON.parse(req.body.restaurant);
    var item=JSON.parse(req.body.item);
    console.log(userdetails,restaurant,item);
    var orders = new Orders();
    orders.userdata=userdetails;
    orders.restaurant=restaurant;
    orders.item=item;
    orders.userid=userdetails._id;
    orders.restaurantid=restaurant._id;
    orders.itemname=item.itemname;
    orders.itemdesc=item.description;
    orders.custname=userdetails.name;
    orders.restaurantname=restaurant.name;
    orders.amount=req.body.amount;
    cl4.insertOne(orders, function(err, res) {
              if (err) throw err;
              console.log("1 order inserted");
              
            });
    res.redirect('/displayitems')
  });



  router.route('/orderlist')
  .get(function(req, res, next) {
        var alertdata="No orders in your list"
        if(req.user && req.user.type == "User"){
        console.log("into",typeof(req.user._id))
        cl4.find({userid: String(req.user._id)}).toArray(function(err, resultx) {
       if (err) return console.log(err);
       if(resultx.length >0)
          alertdata=resultx.length + ' items in your order list'
           
              res.render('orderlist', {'result':resultx,'user': req.user,'alertdata':alertdata});
        

     });
      }
      else if(req.user && req.user.type == "Restaurant"){
         cl4.find({restaurantid: String(req.user._id)}).toArray(function(err, resultx) {
       if (err) return console.log(err);
       if(resultx.length >0)
          alertdata=resultx.length + ' items in your order list'
           
              res.render('orderlist', {'result':resultx,'user': req.user,'alertdata':alertdata});
        

     });
          
      }
      else{
        res.render('login',{alertdata : "Please Login to view Orders Page"});
      }
  });
});





module.exports = router;
