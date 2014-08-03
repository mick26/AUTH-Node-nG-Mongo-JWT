## Synopsis


Authentication with NodeJS, ExpressJS, AngularJS and MongoDB.

The server secures Angular route URL's with the help of JSON Web Tokens (JWT's).


# Angular Routes 

User creation/logon and Authentication is managed using the following $http routes: 

* post /register		:	register a username, password, Email
* post /login			:	login using username & password
* get /admin			:	a route secured using JWT
* post logout			:	logout and delete JWT on client


If the user selects a secured route - the JWT is checked and if the JWT is not valid route processing will stop and a 401 (unauthorised) error will be returned.


# Packages Used
- jsonwebtoken middleware to create JWT 
- express-jwt Express middleware to add JWT validation to $http routes 
- Mongoose to connect with the MongoDB
- Bcryptjs to encrypt the plain text password for storage in MongoDB


The program is based on a number of sources see server.js 


# Requirements

* MongoDB running
* Node
* bower client package manager


## Installation

* Clone the Repository
* npm install - install all the node packages listed in the package.json file 
* bower install - installs the front end packages listed in the bower.json file
* Turn on MongoDB
* Open ../server/config/database.js and enter Mongo database details
* node server.js - start up Node\Express server
* Browse to http://localhost:8800


## Technologies Used
 
Node, Express 4.x, Angular, Mongoose, MongoDB, Robomongo MongoDB client, REST API, Bower, Bcryptjs,
$http service to make AJAX requests in AngularJS.


Michael Cullen
2014
