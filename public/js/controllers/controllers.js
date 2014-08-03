
/**********************************************************************
 * Module - For Controllers
 **********************************************************************/
angular.module('myApp.controllers', [])



  /**********************************************************************
   Register controller
   **********************************************************************/

  .controller('RegisterCtrl', function ($scope, $http, $location, $window, AuthenticationService, $rootScope) {

    $scope.register = function register(username, password, passwordConfirm) {

        if (AuthenticationService.isLogged) {
          console.info("Logged in already!!!!"); //TEST
          $location.path("/admin");
        }
        else {
          console.info("scope.register= " +$scope.user);  //TEST


          $http.post('/register', $scope.user) 

             .success(function(data, status, headers, config)  {
                $location.path("/login");
            })

            .error(function(data, status, headers, config) {
                if(status==409) {
                  $scope.error = 'Duplicate username: Please select a different username';
                }

                if(status==400) {
                  $scope.error = 'ERROR: Password Confirmation does not match Password';
                }
            });
        }
    }
  })



/**********************************************************************
 * Login controller
 **********************************************************************/
.controller('LoginCtrl', function ($scope, $http, $location, $window, AuthenticationService, $rootScope) {

  $scope.error = '';

  $scope.login = function () {

    $http.post('/login', $scope.user)      
      //success
    .success(function (data, status, headers, config) 
    {
		    console.log("POST /login success");			    //TEST
        $window.sessionStorage.token = data.token;  //save JWT to sessionStorage.
        AuthenticationService.isLogged = true;		  //Logged In **
		    console.log("AuthenticationService.isLogged= "+ AuthenticationService.isLogged); //TEST
	
		    var encodedProfile = data.token.split('.')[1];
        var profile = JSON.parse(url_base64_decode(encodedProfile));
		
    		//console.log("profile = " + JSON.stringify(profile));			//TEST
    		console.log("Email = " + JSON.stringify(profile.email));			//TEST
        console.log("Username = " + JSON.stringify(profile.username));      //TEST
    		$scope.error = '';
        $rootScope.welcome = 'Welcome ' + JSON.stringify(profile.username);		
        // $location.url('/login');
	 })
      
      //error
      .error(function (data, status, headers, config) 
      {
    		console.log("post /login ERROR");
  	 	  //Erase JWT token if the user fails to log in
        delete $window.sessionStorage.token;        
  		  AuthenticationService.isLogged = false;	//NOT Logged In **
  		
  		  //Handle login errors here
        $scope.error = 'Error: Invalid user or password';
        $scope.welcome = 'Invalid User';
      });
  }  
})



 /**********************************************************************
  * Admin controller
  **********************************************************************/

  .controller('AdminCtrl', function($scope, $http, $location, AuthenticationService, $window, $rootScope) {

    $http.get('/admin')
    
    //success
    .success(function (data, status, headers, config) 
    {
      console.log("Entered Private /Admin area success: data = " + JSON.stringify(data));


        var encodedProfile =$window.sessionStorage.token.split('.')[1];
        var profile = JSON.parse(url_base64_decode(encodedProfile));
    
        //console.log("profile = " + JSON.stringify(profile));      //TEST
        console.log("firstname = " + JSON.stringify(profile.firstname));      //TEST
        $scope.error = '';
        $rootScope.welcome = 'Welcome ' + JSON.stringify(profile.firstname);   

    })
    
    //error
    .error(function (data, status, headers, config) 
    {
      console.log("Authentication Failed: data = " + data );
      $location.url('/login');
      //Erase JWT token
      delete $window.sessionStorage.token;
      AuthenticationService.isLogged = false;    // Logged Out
    });
})


/**********************************************************************
 * Logout controller
 **********************************************************************/
.controller('LogoutCtrl', function ($scope, $http, $window, $location, AuthenticationService, $rootScope) 
{
    $scope.error = '';
	  console.log("In LogoutCtrl **");

		$http.post('/logout') 
		//success
		.success(function (data, status, headers, config) 
		{
			AuthenticationService.isLogged = false;		// Logged In **
		
			console.log("AuthenticationService.isLogged= "+ AuthenticationService.isLogged );
		
			//Erase JWT token if the user fails to log in
			delete $window.sessionStorage.token; 

			console.log("/logout SUCCESS");
	//		$scope.message = $scope.message + ' ' + data.first_name; //

      $location.url('/login');

		})
    
		//error
		.error(function (data, status, headers, config) 
		{
			console.log("/logout ERROR");
			alert(data);
		});
});








