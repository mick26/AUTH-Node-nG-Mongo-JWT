
/*================================================
Main Module
================================================ */
angular.module('myApp', ['myApp.controllers', 'myApp.services', 'ngRoute'])


.config(function ($routeProvider, $locationProvider, $httpProvider) 
{
	/*==================================================
  Add Interceptor in the $httpProvider
	Adds Header to each request to server
	Header contains JWT Token 
  ================================================== */
    $httpProvider.interceptors.push('authInterceptor')

    /*================================================
    Define all the Routes
    ================================================ */
    $routeProvider

      .when('/', {
        templateUrl: '/views/main.tpl.html'
		    //access: {requiredLogin: false}
        //controller: 'UserCtrl'
      })

      .when('/admin', {
        templateUrl: 'views/admin.tpl.html',
        controller: 'AdminCtrl',
		    access: {requiredLogin: true}
      })
	
	  
      .when('/login', {
        templateUrl: 'views/login.tpl.html',
        controller: 'LoginCtrl',
		    access: {requiredLogin: true}
      })
	  
	  .when('/logout', {
        templateUrl: 'views/login.tpl.html',
        controller: 'LogoutCtrl',
        access: { requiredLogin: true }
      })

    .when('/about', {
        templateUrl: 'views/about.tpl.html',
        //controller: 'LogoutCtrl',
        access: { requiredLogin: false }
      })	  

     .when('/register', {
        templateUrl: 'views/register.tpl.html',
        controller: 'RegisterCtrl'
      })
      
      .otherwise({
        redirectTo: '/login'
      })

    //================================================
})

.run( function($rootScope, $location, $window, AuthenticationService) {
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

		//redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredLogin 
            && !AuthenticationService.isLogged && !$window.sessionStorage.token) {
			
            $location.path("/login");	
		}
	});
	

})




//Ref. polifyll https://github.com/davidchambers/Base64.js
//this is used to parse the profile contained in the JWT
function url_base64_decode(str) 
{
  var output = str.replace('-', '+').replace('_', '/');
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
};


/*
Ref. https://docs.angularjs.org/guide/module
Run blocks are the closest thing in Angular to the main method. A run block is the 
code which needs to run to kickstart the application. It is executed after all of 
the service have been configured and the injector has been created. Run blocks typically 
contain code which is hard to unit-test, and for this reason should be declared in isolated 
modules, so that they can be ignored in the unit-tests
*/
