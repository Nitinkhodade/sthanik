/**
 * @ngdoc function
 * @name bringGroceryApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bringGroceryApp
 */
var app = angular.module('bringGroceryApp');

app.controller('signUpCtrl', function ($scope, $location,authService,ngToast) {

	var userData=null;

    this.login=function(){
    	/**** TODO: set the area and city in cookies... for now just moving forward *****/
    	$location.path("signUp");
    };
	
	
    $scope.registerUser = function(credentials,isValid) {
    	if(!isValid) return false;
        var promise = authService.getUserRegistered(credentials);
        promise.then(function(data) {
            ngToast.create({
                className: 'success',
                content:  data.statusText
              });
	      $('.close').trigger('click');
        }, function(reason) {
            ngToast.create({
                className: 'danger',
                content:  data.statusText
              });
        });
    };
});
