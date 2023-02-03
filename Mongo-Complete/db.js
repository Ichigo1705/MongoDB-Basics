const { MongoClient } = require('mongodb');

module.exports = {
    connectToDb: function(cb){  // Establishing Connection to Database
        var url = 'mongodb://127.0.0.1:27017/bookstore'
        MongoClient.connect(url)
         .then(function(client){
            dbConnection = client.db();
            return cb();
         })
         .catch(function(err){
            console.log(err);
            return cb(err);
         });
    },
    getDb: function(){ //Getting the Database
        return dbConnection;
    }
}