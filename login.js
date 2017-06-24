/**
 * @ngdoc function
 * @name bringGroceryApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bringGroceryApp
 */
var app = angular.module('bringGroceryApp');

app.controller('loginCtrl', function($scope,$rootScope, $location, groceryService,dataFactory, $http ,authService,ngToast) {

  //inital setup before click on login..... Update this object with response on sucess login
   $scope.vendorFlag = false;

   $scope.changeFlagToTrue = function(flag) {
	   $scope.vendorFlag=flag;
   };

  $scope.getUserLoggedIn = function(credentials,isValid) {
	  var loginDetails = {
      "userName": credentials.username,
      "password": credentials.password,
      "userType": $scope.vendorFlag ? 'V' : 'C'// TO 'userType' with possible values 'C' / 'V'
    };

	if(!isValid)
		return false;

    var promise = groceryService.getUserAuthenticate(loginDetails);
    $scope.loginLoader = true;
    promise.then(function(data) {
        var details;

        $scope.loginLoader = false;
        if(data.statusCode > 0){
            details = data.data;
            $scope.rc.signinresponse = details;
            $rootScope.updateCookieData('authToken', details.token);
            $rootScope.updateCookieData('userName',details.userName);
            $rootScope.updateCookieData("custId",details.custId);
            $rootScope.updateCookieData("userType",details.userType);
            $('.close').trigger('click');
            if($scope.rc.autoRedirectToCheckout){
          	  $scope.rc.autoRedirectToCheckout = false;
          	  $location.path("/checkout");
            }
        } else {
            $scope.failureLoginHandle(data);
        }
    }, function(data){
        $scope.failureLoginHandle(data);
    });
  };

  $scope.failureLoginHandle = function(data) {
      var errorMsg = 'Invalid Username or Password!! Please try again';
      $scope.loginLoader = false;
      $scope.loginFailure = true;
      $scope.failureMsg = errorMsg;
      ngToast.create({
          className: 'danger',
          content: errorMsg
        });
      window.console.log('Failure: ' + data);
  };

  $scope.showForgetPassword = function() {
    $('.login-block').slideUp(400);
    $('.forgotPassword-block').slideDown(400);
  };

  $scope.backToLogin = function() {
    $('.forgotPassword-block').slideUp(400);
    $('.login-block').slideDown(400);
  };

  $scope.validateUsername = function(credentials) {
	    var resetDetails = {
	    	      "userName": credentials.userName,
	    	      "userType": $scope.vendorFlag ? 'V' : 'C'
	    	    };

	  var promise = authService.sendPasswordUpdateEmail(resetDetails);
	   promise.then(function(data){
	        ngToast.create({
	            className: 'success',
	            content: data.statusText
	          });

		  $location.path("/");
	      $('.close').trigger('click');
	   });
  };
});
