/* ========================================================== 
Michael Cullen

Authentication: JSON Web Token

2014

A Work in Progress


Ref.
https://github.com/kdelemme/blogjs
https://github.com/roblevintennis/passport-api-tokens
http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/
https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/
https://github.com/auth0/angular-token-auth
https://docs.auth0.com/nodeapi-tutorial
https://auth0.com/
OAuthO Book: http://hueniverse.com/oauth/
https://docs.auth0.com/nodejs-tutorial
http://jwt.io/
============================================================ */
'use strict';


/* ========================================================== 
External Modules/Packages Required
============================================================ */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var colours = require('colors');
var logger = require('morgan');
var http = require('http');

/* ========================================================== 
Internal App Modules/Packages Required
============================================================ */
var routes = require('./server/routes.js');       	//Exchange routes

/* ========================================================== 
Create a new application with Express
============================================================ */
var app = express();

/* ========================================================== 
Set the Port
============================================================ */
app.set('port', process.env.PORT || 8800);


/* ========================================================== 
Use Middleware
============================================================ */
//app.use(bodyParser()); 				//bodyParser includes JSON & Urlencoded
// parse application/json
app.use(bodyParser.json())

app.use(logger('dev'));				//log request in dev mode only to the console

/* ========================================================== 
serve the static index.html from the public folder
============================================================ */
app.use(express.static(__dirname + "/public"));


/* ========================================================== 
authRoutes - using Express
============================================================ */
routes(app);


/* ========================================================== 
Create HTTP Server using Express
============================================================ */
var server = http.createServer(app);


/* ========================================================== 
Start HTTP Server Listening on a port
============================================================ */
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' .red + app.get('port')  ) ;
});


