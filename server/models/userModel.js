
/* ========================================================== 
Connect to MongoDB
Create Mongoose Schema-describes the data structure
Convert the Schema to a Model-so it can be worked with

Use 'bcryptjs' to encrypt (hash) the passwords saved to the DB
The randomly generated salt is incorporated into the encryption
no need to store it separately

Ref.
http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
============================================================ */



/* ========================================================== 
External Modules/Packages Required
============================================================ */
var mongoose = require('mongoose');     //MongoDb interaction
var bcrypt = require('bcryptjs');       //Encryption package
var SALT_WORK_FACTOR = 10;              //No computation cycles with Encryption

//Mongoose version
console.log('Running mongoose version %s', mongoose.version); 

/********************************************************************
Specify MongoDB
*********************************************************************/
var dbConfig = require('../config/database');   
var dbUrl = dbConfig.url;

//console.log("dburl= "+dbUrl);           //TEST

exports.mongoose = mongoose;


/********************************************************************
Run MongoDB in safe mode - wait for INSERT operations to succeed
important when altering passwords.
*********************************************************************/
var mongoOptions = { db: { safe: true }};

/********************************************************************
Connect to MongoDB
*********************************************************************/
mongoose.connect(dbUrl, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + dbUrl + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + dbUrl);
  }
});


/********************************************************************
Mongoose Schema - maps to a MongoDB collection
Defines the documents in the collection. 
http://mongoosejs.com/docs/guide.html
*********************************************************************/
var Schema = mongoose.Schema;

/********************************************************************
    Create a Mongoose Schema Object
    Ref. http://mongoosejs.com/docs/schematypes.html
*********************************************************************/
var userSchema = new Schema( {
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  is_admin: { type: Boolean, required: true },
  created: { type: Date, default: Date.now }
} );

//To add additional keys later, use the Schema#add method

/****************************************************************************
    Bcryptjs
    pre function runs before model is saved to DB. Needed because hash fn is
    asynchronous and need to ensure clear text pw is never saved to DB.
    Bcryptjs has the salt embeded into the hash. 
    http://danielstudds.com/setting-up-passport-js-secure-spa-part-1/#note-204-3
*****************************************************************************/
userSchema.pre('save', function(next) {
    var user = this;


    if(!user.isModified('password')) 
    	return next();
 

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) 
        	return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) 
            	return next(err);
            user.password = hash;
            next();
        });

    });


});

/********************************************************************
Password verification
*********************************************************************/
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) 
        	return cb(err);

        cb(null, isMatch);
    });
};


/********************************************************************
In order to use Schema have to convert it to a Model
Create Mongoose Model - mongoose.model(modelName, schema)
Export Mongoose Model
*********************************************************************/
UserModel = mongoose.model('User', userSchema);


/********************************************************************
    Export Mongoose Model-make it available in other files
*********************************************************************/
exports.UserModel = UserModel;

//module.exports = mongoose.model('UserModel', userSchema );