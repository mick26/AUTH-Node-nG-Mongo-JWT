angular.module('myApp.services', [])


.factory('AuthenticationService', function($rootScope, $window) {
	
  // var auth = {
  if( !$window.sessionStorage.token ) {
    var auth = {
		    isLogged: false
    }
  }
    if( $window.sessionStorage.token ) {
    var auth = {
        isLogged: true
    }
	}
	
	$rootScope.auth = auth;
	
	return auth;
})



/*
Now we have the JWT saved on sessionStorage. 
If the token is set, we are going to set the Authorization HEADER for every outgoing request done using $http. 
As value part of that header we are going to use Bearer <token>.

sessionStorage: Although is not supported in all browsers (you can use a polyfill) 
is a good idea to use it instead of cookies ($cookies, $cookieStore) and localStorage: 
The data persisted there lives until the browser tab is closed.
*/
.factory('authInterceptor', function ($rootScope, $q, $window, AuthenticationService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },

    response: function (response) {
      if (response.status === 401) {
        alert("Not Logged On");
  
  // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});



