'use strict';

/**********************************************************************
 * Module - For Controllers
 **********************************************************************/
angular.module('myApp.userControllers', [])
  
/**********************************************************************
 Main Controller
 **********************************************************************/
.controller('MainCtrl', function ($scope, $http, $location, $window, AuthenticationService, $rootScope, $log, userService, base64) {

  $scope.message = {
    error:"",
    success:"",
    info:""
  };

  if (AuthenticationService.isLogged) {
    $log.info("Logged in already!!!!"); //TEST
    $scope.message.info = "You are Logged in already - You will be diverted to /admin Automatically!!!!";
    $location.path("/admin");
  }

  /* 
  If JWT exists in session storage (i.e. user logged in)
  Extract username from JWT
  */   
  if($window.sessionStorage.token) {
    userService.loggedOnAlreadyMsg();
  }
})


/**********************************************************************
 Register controller
 **********************************************************************/
.controller('RegisterCtrl', function ($scope, $http, $location, $window, AuthenticationService, $rootScope, $log, userService) {

  $scope.message = {
    error:"",
    success:"",
    info:""
  };


  $scope.register = function register(username, password, passwordConfirm) {

      if (AuthenticationService.isLogged) {
        $log.info("Logged in already!!!!"); //TEST
        $scope.message.info = "You are Logged in already!!!!";
        $location.path("/admin");
      }
      else {
        //Request
        userService.registerUser($scope.user)                                    
        //Response Handler
        .then(function(user) {   
          $log.info("You are now Registered");
          $scope.message.success = "You are now Registered";
          $location.path("/login");
        },
        function(error) {
          $log.info("Error when trying to Register");
          $scope.message.success = "";
          $scope.message.error = error;
        })        
    };
  }
})

/**********************************************************************
 * Login controller
 **********************************************************************/
.controller('LoginCtrl', function ($scope, $http, $location, $window, AuthenticationService, $rootScope, userService, base64) {

  //$scope.error = '';

  $scope.message = {
    error:"",
    success:"",
    info:""
  };

  $scope.login = function() {

    //Request
    userService.loginUser($scope.user)                                    
      //Response Handler
      .then(function(profile) {   
          AuthenticationService.isLogged = true;      //Logged In **              
          $scope.message.error = "";
          $scope.message.success = "You have successfully logged on!!";
          $rootScope.welcome = 'You are Logged on as ' + JSON.stringify(profile.username) + " | ";
      },
      function(error) {
        AuthenticationService.isLogged = false; //NOT Logged In **
        //Handle login errors here
        $scope.message.error = 'Invalid username or password';
        $scope.message.success = "";
        $rootScope.welcome = 'Invalid User';
      });
    }


    /* 
    If JWT exists in session storage (i.e. user logged in)
    Extract username from JWT
    */   
    if($window.sessionStorage.token) {
      userService.loggedOnAlreadyMsg();
    }
})

/**********************************************************************
 * Admin controller
 **********************************************************************/
.controller('AdminCtrl', function($scope, $http, $location, AuthenticationService, $window, $rootScope, userService) {

  $scope.message = {
    error:"",
    success:"",
    info:""
  };

  //Request
  userService.getAdmin()                                    
    //Response Handler
    .then(function(profile) {   
        AuthenticationService.isLogged = true;      //Logged In              
        $scope.message.error = "";
        $rootScope.welcome = 'You are Logged on as ' + JSON.stringify(profile.username) + " | ";
      },
      function(error) {
        AuthenticationService.isLogged = false; //Logged Out
        //Handle login errors here
        $scope.message.error = "Unable to access /admin";
        $rootScope.welcome = "";
        $location.url('/login');
      });
})


/**********************************************************************
 * Logout controller
 **********************************************************************/
.controller('LogoutCtrl', function($scope, $http, $window, $location, 
  AuthenticationService, $rootScope, $log, userService) {

  $scope.message = {
    error:"",
    success:"",
    info:""
  };

  //Request
  userService.logoutUser()                                    
    //Response Handler
    .then(function(profile) {   
      AuthenticationService.isLogged = false;      //Logged In **  
      $scope.message.error = ""; 
      $scope.message.success = "You have logged out successfully!!"; 
      $log.info("You have logged out successfully!!")             
      $location.url('/login');   
    },
    function(error) {
      AuthenticationService.isLogged = false; //NOT Logged In **
      $log.info("Error logging out!!")     
      $scope.message.error = "Error logging out!!"; 
      $scope.message.success = "";         
    });
})


/**********************************************************************
* About controller
**********************************************************************/
.controller('AboutCtrl', function($scope, $window, $rootScope, base64, $log, userService) {

    $scope.message = {
      error:"",
      success:"",
      info:"Look! I am an about page."
    };


    /* 
    If JWT exists in session storage (i.e. user logged in)
    Extract username from JWT
    */   
    if($window.sessionStorage.token) {
      userService.loggedOnAlreadyMsg();
    }
}); 

