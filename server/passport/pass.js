
/********************************************************************
  Passport
*********************************************************************/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/********************************************************************
Step1.   Tell passport how it can serialize and deserialize users
*********************************************************************/

/********************************************************************
  serialise is called when the user logs in. 
  Whatever is passed as done (2nd param) will be stored in the session
*********************************************************************/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});


/********************************************************************
  Deserialize takes the id stored in the session.
  We use that id to retrieve the user.
*********************************************************************/
passport.deserializeUser(function(id, done) {
  db.UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});


/********************************************************************
Step 2. Configure passsport to use LocalStrategy 
(Middleware that does authentication)
Passport:
- extracts username & password from body
- passes username & password to LocalStrategy()
- looks up user in DB
- verify passwords 
*********************************************************************/
passport.use(new LocalStrategy(function(username, password, done) {

// console.log("username: "+username);  //TEST
// console.log("username: "+password);  //TEST

  db.UserModel.findOne( { username: username }, function(err, user) {
    
    if (err) { 
      return done(err); 
    }
    if (!user) { 
      return done(null, false, { message: 'Unknown user ' + username });
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) 
        return done(err);
      
      if(isMatch) {
        return done(null, user);
      } 
      else {
        return done(null, false, { message: 'Invalid password' });
      }

    });
  });
}));


// Route middleware to ensure user is authenticated.  
// Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {

  if (req.isAuthenticated()) { 
    return next(); 
  }
  
  res.redirect('/login')
};




// Check that user is 'admin' user
// middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
// Ref. http://danielstudds.com/setting-up-passport-js-secure-spa-part-1/
exports.ensureAdmin = function ensureAdmin(req, res, next) {
        if(req.user && req.user.admin === true)
            next();
        else
            res.send(403);
};