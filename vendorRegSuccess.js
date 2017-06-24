var app = angular.module('bringGroceryApp');
app.controller('vndrRegSucsCtrl', function ($scope,$location,$http,authService,ngToast) {
    $scope.whichMessage = "N";

	$scope.init = function() {
    	$scope.whichMessage = $location.search().data;
    };

});
