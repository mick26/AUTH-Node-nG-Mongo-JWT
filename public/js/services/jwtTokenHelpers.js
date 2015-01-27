/* =============================================================
To Decode JWT

Ref. 
https://github.com/davidchambers/Base64.js
//this is used to parse the profile contained in the JWT
============================================================== */

'use strict';
/*================================================================
Module - for base64 Factory Service
=================================================================*/
angular.module('myApp.base64Service', [])

/*
 * Factory Service
 */
.factory('base64', function ($window, $q) {

	return {
    	encode: function (input) {
    		//Do not encode need for this App
            var output = "";
            return output;
        },

        //Decodes JWT
        decode: function (encodedJWT) {
			var output = encodedJWT.replace('-', '+').replace('_', '/');
		  	switch (output.length % 4) {
		    	case 0:
		      		break;
		    	case 2:
		      		output += '==';
		      		break;
		    	case 3:
		      		output += '=';
		      		break;
		    	default:
		      		throw 'Illegal base64url string!';
		  	}
		  	return window.atob(output); 
        },

        //Get user from JWT
        getJwtProfile: function () {        
        	var deferred = $q.defer();       
		    if($window.sessionStorage.token) {
			    var encodedProfile = $window.sessionStorage.token.split('.')[1]; //From JWT
			    var decodedProfile = JSON.parse( this.decode(encodedProfile) );
			    deferred.resolve(decodedProfile);
          	}
			else {
				deferred.reject("OOPS No JWT Token exists in sessionStorage!!! ");//TEST
			}
           	return deferred.promise; //returns the promise
		},

		deleteJwtFromSessionStorage : function() {
			delete $window.sessionStorage.token; 
		},

		saveJwtToSessionStorage : function(token) {
			$window.sessionStorage.token = token;  //save JWT to sessionStorage.
		}
    };
})
