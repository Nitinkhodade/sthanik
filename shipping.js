var app = angular.module('bringGroceryApp');

app.controller('shippingCtrl', function($scope, $location, groceryService, $http, $cookieStore, $rootScope) {
    var promise,
        showForm = false,
        me = this;
    $scope.cc.existingAddress = {};
    $scope.address = {};
    $scope.updateFlag = false;
    $scope.rc.addressAvailable = false;
    /***** Main method which execute first ***/
    $scope.init = function() {
        me.getAddress();
    };

    this.getAddress = function() {
        //debugger
        promise = groceryService.retriveCustomerAddress($rootScope.getCookieData("custId"));
        promise.then(function(data) {
            //statusCode 1 means address found
            if(data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS){
                $scope.rc.addressAvailable = true;
                $scope.cc.existingAddress = data.data;
            } else {
                $scope.rc.addressAvailable = false;
            }
        });
    };

    $scope.editAddress = function() {
        $scope.updateFlag = true;
        $scope.rc.addressAvailable = false;
        $scope.address = JSON.parse(JSON.stringify($scope.cc.existingAddress));
    };

    $scope.cancelUpdate = function() {
        $scope.rc.addressAvailable = true;
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    };

    $scope.updateAddress = function(address, isFormValid) {
        if (!isFormValid) {
            return false;
        }
        address.country = 'India';
        address.custId = $rootScope.getCookieData("custId");
        /************ Just to solve error. Need to have only one API for both ADD and Update*****/
        promise = groceryService.saveCustomerAddress(address);
        promise.then(function(data) {
            $scope.cc.existingAddress = address;
            $scope.rc.addressAvailable = true;
        });
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    };
});
