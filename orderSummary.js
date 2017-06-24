var app = angular.module('bringGroceryApp');
app.controller('orderSummaryCtrl', function($scope, $location, groceryService, $http, $cookieStore, shoppingCart, $rootScope, $window, $mdDialog) {
    var promise,
        me = this;
    $scope.rc.customerRemarks = "";
    $scope.rc.agree = false;
    $scope.rc.payMode = "N";
    $scope.init = function() {
        // $scope.rc.updateDeliveryCharges();
    };
    $scope.$parent.$on("makeOrder", function(event) {
        $scope.confirmOrder();
    });
    $scope.getCart = function() {
        return shoppingCart.getCart();
    };
    $scope.getStore = function() {
        return shoppingCart.getStore();
    };
    $scope.savePayMode = function() {
        //console.log($scope.rc.payMode);
        if ($scope.rc.payMode === "PAY_NOW") {
            //calculate transaction charges
            $scope.rc.cart.transactionCharges = shoppingCart.calcTransCharges($scope.rc.cart.totalAmount + $scope.rc.cart.deliveryCharges);
            //console.log($scope.rc.cart.transactionCharges);
        } else {
            $scope.rc.cart.transactionCharges = 0;
        }
    };
    $scope.confirmOrder = function() {
        if ($scope.rc.payMode === "N") {
            $mdDialog.show($mdDialog
                .alert()
                .title('Alert!!')
                .textContent("Please Select Payment Mode")
                .ok('Okay')
            );
            return;
        }

        if ($scope.rc.agree !== true) {
            alert();
            $mdDialog.show($mdDialog
                .alert()
                .title('Alert!!')
                .textContent("Please select I agree checkbox to submit order")
                .ok('Okay')
            );
            return;
        }
        var orderDetails = $scope.rc.getFullOrderDetails();
        orderDetails.addressId = $scope.cc.existingAddress.addressId;
        orderDetails.customerRemarks = $scope.rc.customerRemarks;
        orderDetails.payMode = $scope.rc.payMode;
        orderDetails.agree = $scope.rc.agree;
        orderDetails.discount = $scope.rc.cart.discountValue;
        orderDetails.coupanCode = $scope.rc.cart.couponCode;
        orderDetails.deliveryCharges = $scope.rc.cart.deliveryCharges;
        orderDetails.transactionCharges = $scope.rc.cart.transactionCharges;

        //ideally we should calculate payTotal as following
        //verify this does not impact UI and the value shown to user and payTotal calculated here should match otherwise User are probably going to complain
        orderDetails.payTotal = orderDetails.orderTotal + orderDetails.deliveryCharges - orderDetails.discount + orderDetails.transactionCharges;

        promise = groceryService.placeOrder(orderDetails);
        $scope.$parent.checkoutLoader = true;
        promise.then(function(data) {
            //based on submit order api response decide further flow
            console.log(data);

            //statusCode -1 - means server side exception has occured, please check server logs for more details
            //statusCode 0 - means some server side validation has failed, please check statusText
            if (data.statusCode <= $scope.rc.CONST.STATUS_CODE_FAILED) {
                $scope.$parent.checkoutLoader = false;
                $mdDialog.show($mdDialog
                    .alert()
                    .title('ERROR!!')
                    .textContent(data.statusText)
                    .ok('Okay')
                );
                //this is sthanik validation error message, show the message to user
            }
            //statusCode 1 - means order placed successfully
            else if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
                //order checkout success, with COD paymode
                $scope.$parent.checkoutLoader = false;
                shoppingCart.cleanCart();
                $scope.rc.resetCart();
                $scope.$parent.$broadcast('orderSuccess', data);
            }
            //statusCode 2 - means order payment request created successfully, redirect to payment screen
            else if (data.statusCode === $scope.rc.CONST.STATUS_CODE_REDIRECT) { //2
                $window.location.href = data.data;
            }
        });
    };
});
// this.getAddress = function() {
//       promise = groceryService.retriveCustomerAddress($rootScope.getCookieData("custId"));
//       promise.then(function(data) {
//        $scope.existingAddress.custId=data.custId;
//    	$scope.existingAddress.addressLine1=data.addressLine1;
//    	$scope.existingAddress.addressLine2=data.addressLine2;
//    	$scope.existingAddress.city=data.city;
//    	$scope.existingAddress.state=data.state;
//    	$scope.existingAddress.pinCode=data.pinCode;
//    	$scope.existingAddress.country=data.country;
//       });
//     };
//
// is.getAddress();
