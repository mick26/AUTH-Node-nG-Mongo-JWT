'use strict';
/*================================================
Main Module
================================================ */
angular.module('myApp', ['myApp.userControllers', 'myApp.authServices', 'myApp.userServices', 'ngRoute', 'myApp.base64Service'])


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
        templateUrl: '/views/main.tpl.html',
        controller: 'MainCtrl',
        resolve: {
          app: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function() {
                  defer.resolve();
              }, 2000);
              return defer.promise;
          }
        },
        access: {requiredLogin: false}
      })

      .when('/admin', {
        templateUrl: 'views/admin.tpl.html',
        controller: 'AdminCtrl',
        resolve: {
          app: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function() {
                  defer.resolve();
              }, 4000);
              return defer.promise;
          }
        },
		    access: {requiredLogin: true}
      })
	
	  
      .when('/login', {
        templateUrl: 'views/login.tpl.html',
        controller: 'LoginCtrl',
        resolve: {
          app: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function() {
                  defer.resolve();
              }, 2000);
              return defer.promise;
          }
        },
		    access: {requiredLogin: true}
      })
	  
	  .when('/logout', {
        templateUrl: 'views/login.tpl.html',
        controller: 'LogoutCtrl',
        resolve: {
          app: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function() {
                  defer.resolve();
              }, 2000);
              return defer.promise;
          }
        },
        access: { requiredLogin: true }
      })

    .when('/about', {
        templateUrl: 'views/about.tpl.html',
        controller: 'AboutCtrl',
        access: { requiredLogin: false }
      })	  

     .when('/register', {
        templateUrl: 'views/register.tpl.html',
        controller: 'RegisterCtrl',
        resolve: {
          app: function($q, $timeout) {
              var defer = $q.defer();
              $timeout(function() {
                  defer.resolve();
              }, 2000);
              return defer.promise;
          }
        },
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


/*
Ref. https://docs.angularjs.org/guide/module
Run blocks are the closest thing in Angular to the main method. A run block is the 
code which needs to run to kickstart the application. It is executed after all of 
the service have been configured and the injector has been created. Run blocks typically 
contain code which is hard to unit-test, and for this reason should be declared in isolated 
modules, so that they can be ignored in the unit-tests
*/
