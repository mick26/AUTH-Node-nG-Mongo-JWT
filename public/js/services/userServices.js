'use strict';

/*================================================
Module - for the Services
================================================ */

angular.module('myApp.userServices', [])

.service('userService', function($http, $q, $window, base64, $rootScope, $log) {

	return {

		loggedOnAlreadyMsg : function() {    
			//Request
		    base64.getJwtProfile()    
		      //Response Handler
		      .then(function(profile) {
		      	$rootScope.welcome = 'You are Logged on as ' + JSON.stringify(profile.username) + " | ";
		      },
		      function(error) {
		        $log.error("Error getting token" + error);
		      });  
		},

		registerUser : function(user) {
		  var deferred = $q.defer();
		    $http.post('/register', user)           
		      .success(function(user) {    
		        deferred.resolve("Registered OK" + user);
		      })
		      .error(function(reason, status) {
		      	var problem = "";
		        if(status==409) {          
		          $log.error('Duplicate username: Please select a different username');
		          problem = "Duplicate username: Please select a different username";
		        }
		        if(status==400) {
		          $log.error('Password Confirmation does not match Password');
		          problem = "Password Confirmation does not match Password";
		        };
		        deferred.reject(problem);//TEST

		      });
		      return deferred.promise; //returns the promise    
		},


		loginUser : function(user) {

		  var deferred = $q.defer();
		  $http.post('/login', user)      
		    .success(function(user) {
		      base64.saveJwtToSessionStorage(user.token);
		      var profile = base64.getJwtProfile();   
		      deferred.resolve(profile);
		    })
		    .error(function(reason, status) {
		      //Erase JWT token if the user fails to log in
		      base64.deleteJwtFromSessionStorage(); 
		      deferred.reject("OOPS Unable to Login!!!" + reason);//TEST
		    });
		    return deferred.promise; //returns the promise    
		},


		logoutUser : function() {

		  var deferred = $q.defer();      
		  $http.post('/logout')      
		    .success(function(data, status) {           
		      base64.deleteJwtFromSessionStorage();
		      deferred.resolve("Success with logout" + data );
		    })

		    .error(function(reason, status) {
		      $rootScope.welcome = 'Invalid User';
		      deferred.reject("OOPS Unable to Logout!!!" + reason);//TEST
		    });
		    return deferred.promise; //returns the promise    
		},


		getAdmin : function() {

		  var deferred = $q.defer();      
		  $http.get('/admin')      
		    .success(function(data, status) {           
		      $log.info("Succeeded in Entering Private /Admin area");
		      var profile = base64.getJwtProfile();  
		      deferred.resolve(profile);
		    })
		    .error(function(reason, status) {
		      base64.deleteJwtFromSessionStorage();//delete token
		      deferred.reject("OOPS Unable to enter /admin!!! " + reason);//TEST
		    });
		    return deferred.promise; //returns the promise    
		}
	}  //@END return()
}); //@ EOF
