/* ========================================================== 
External Modules/Packages Required
============================================================ */
//To sign i.e. create the JWT
var jwt = require('jsonwebtoken');  		//https://npmjs.org/package/node-jsonwebtoken
//Express middleware to validate a JSON Web token
var expressJwt = require('express-jwt'); 	//https://npmjs.org/package/express-jwt
										
var db = require('./models/userModel');	//Mongoose Model

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


	/*================================================================
	$HTTP post /logout
	=================================================================*/
	app.post('/logout', function(req, res) {
		res.send(200);
	});
	

	/*================================================================
	$HTTP post /login
	=================================================================*/
	app.post('/login', function (req, res) 
	{
		//validate req.body.username and req.body.password
	  	//if is invalid, return 401
	  	var username = req.body.username || '';
		var password = req.body.password || '';
		
		if (username == '' || password == '') { 
			return res.send(401); 
		}

		db.UserModel.findOne({username: req.body.username}, function (err, user) {
			
			if (err) {
				console.log(err);
				return res.send(401);
			}

			if (user == undefined) {
				return res.send(401);
			}
			
			user.comparePassword(req.body.password, function(err, isMatch) {
				if (!isMatch) {					
					console.log("Attempt failed to login with " + user.username);
					return res.send(401);
	            }

	           	var userProfile = {
					username: user.username,
					admin: user.is_admin,
					created: user.created,
					email: user.email
				};

				/*
				*Build the JWT - using jsonwebtoken.js method sign(payload, secretOrPrivateKey, options)
				*return type is a string
				*put users profile inside the JWT (payload)
				*Set token to expire in 60 min (option)
				*/
				var token = jwt.sign(userProfile, secret.JWTsecret, { expiresInMinutes: 60*1 });

				/*
				*Send the token as JSON to user
				*/
				res.json({ token: token });
			});
		});
	});


	/*================================================================
	$HTTP post /register
	=================================================================*/
	app.post('/register', function (req, res) {

		var username = req.body.username || '';
		var password = req.body.password || '';
		var email = req.body.email || '';
		var passwordConfirmation = req.body.passwordConfirmation || '';

		if (username == '' || password == '' || password != passwordConfirmation) {
			return res.send(400);
		}


		var newUser = new UserModel( {
			username : req.body.username,
			password : req.body.password,
			is_admin : true,
			email : req.body.email
		})


		newUser.save(function(err) {
			if (err) {
				console.log(err);
				return res.send(500);
			}
			else {
				return res.send(200);
			}
		});	
			
	});


	/*================================================================
	$http GET /admin - secured by JWT 
	JWT is TX by client in HTTP packet header, JWT is checked
	Express will return 401 and stop the route if token is not valid
	=================================================================*/
	app.get('/admin', expressJwt({secret:secret.JWTsecret}) ,function (req, res) 	
	{
	  console.log('user ' + req.username + ' is calling /admin');
	  console.info("req token=" +JSON.stringify(req.headers));
	  res.send(req.username);
	});

}; /* @END/ module */

