var app = angular.module('bringGroceryApp');
app.controller('contactUsCtrl', function($scope, $location, $http, $cookieStore,dataFactory,ngToast) {
    $('.root-wrapper').attr('id', 'contactus-page');
    $scope.submitContactUs = function(credentials,isValid) {
    	if(!isValid) return false;
    	dataFactory.saveContactUs(credentials)
        .success(function(data) {
            ngToast.create({
                className: 'success',
                content:  data.result
              });
	      $('.close').trigger('click');
        })
        .error(function(error) {
            ngToast.create({
                className: 'danger',
                content:  data.result
              });
        });
		$location.path("/");
    };
});
