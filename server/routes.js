/* ========================================================== 
External Modules/Packages Required
============================================================ */
//Express middleware to validate a JSON Web token
var expressJwt = require('express-jwt'); 	//https://npmjs.org/package/express-jwt
										
/* ========================================================== 
Internal App Modules/Packages Required
============================================================ */
var authRoutes = require('./routes/auth-routes.js');       	//Exchange routes

/* ========================================================== 
JSON Web Token Secret String
============================================================ */
var secret = require('./config/jwtSecret');

/* ========================================================== 
Node Module that will be available in server.js
============================================================ */
module.exports = function(app)
{

	/* ==========================================================
	When you try to access a JWT secured route Express.js sends response 
	"UnauthorizedError: No Authorization header was found"
	without having to add any more code.
	============================================================ */
	/* NOT REQUIRED
	app.use(function(err, req, res, next) {
  		if (err.constructor.name === 'UnauthorizedError') {
    		res.send(401, 'Unauthorized');
  		}
	});
	*/


	/* ========================================================== 
	User Routes
	============================================================ */
	app.post('/register', authRoutes.register);
	app.post('/login', authRoutes.login);
	app.post('/logout', authRoutes.logout);
	app.get('/admin', expressJwt({secret:secret.JWTsecret}), authRoutes.getAdmin);



}; /* @END/ module */

