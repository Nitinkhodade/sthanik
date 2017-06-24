var app = angular.module('bringGroceryApp');

app.controller('completeOrderCtrl', ['$scope', '$location','dataFactory', function($scope, $location, df) {
    var paymentParams = {};
    //Payment status
    // -1 --> Failure
    // 1  --> Success
    // 0  --> Processing
    $scope.paymentStatus = 0;
    $scope.errorMsg = '';
    $scope.isPrePay = false;
    $scope.init = function () {
        paymentParams = $location.search();
        var prm,
            me = this;
        if(!$scope.co.withInApp && $scope.rc.payMode !== 'COD'){
            $scope.isPrePay = true;
            prm = df.getPaymentDetails(paymentParams);
            prm.then(function(data) {
                me.paymentResult(data.data);
            });
        } else {
            $scope.paymentStatus = 1;
        }
    };

    $scope.$parent.$on("orderComplete", function(event, orderData) {
        $scope.paymentResult(orderData);
    });

    $scope.paymentResult = function(orderData) {
        $scope.prePayData = orderData.data;
        if(orderData.statusCode === 1) {
            $scope.paymentStatus = 1; // Success
        }
        else {
            $scope.paymentStatus = -1; // Failure
            $scope.errorMsg = orderData.statusText;
        }
    };

}]);

function myFunction() {
    alert("Order is cancelled successfully!");
         
}
