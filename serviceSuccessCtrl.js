var app = angular.module('bringGroceryApp');
app.controller('serviceSuccessCtrl', function ($scope,$location,$http,ngToast,$rootScope) {
    $scope.prePayData = $scope.rc.prePayData;
    $scope.isPrePay = $scope.rc.isPrePay;
    $scope.paymentStatus = $scope.rc.paymentStatus;

    $scope.init = function() {
    };

});
