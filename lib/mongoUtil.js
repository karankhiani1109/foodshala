
const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://karankhiani_kk:KaranKhiani@cluster0-euhjx.mongodb.net/test?retryWrites=true&w=majority";

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
    	if(err)
    		console.log("Error",err)
    	else
    		  _db  = client.db('foodshala');
    		// console.log(client);
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};		