var app = angular.module('bringGroceryApp');
app.controller('orderHistoryCtrl', function($scope, $location, dataFactory, $routeParams, $rootScope, $mdDialog) {
    var me = this;
    $scope.init = function() {
    	if (!$rootScope.getCookieData('authToken')) {
    		$location.path("/401");
    	}
    	me.getData();
        $('.progress-bar').tooltip();
    };

    this.getData = function() {
        var promise_history = dataFactory.getOrderHistory($rootScope.getCookieData("custId"),$rootScope.getCookieData("userType"));
        $scope.orderHistoryLoading = true;
        promise_history.success(function(data) {
            $scope.orderHistoryLoading = false;
            $scope.orderHistory = data.data;
        });
    };

    $scope.go = function(clickOrder) {
        //alert("itemId:"+clickOrder.orderItems);
        $scope.selectedOrder = clickOrder.orderItems;
        $scope.sOrderDCharges = clickOrder.deliveryCharges;
        $scope.sOrderTAmount = clickOrder.orderTotal;
        $scope.grandTotal = clickOrder.grandTotal;
        $scope.discount = clickOrder.discount;
		$scope.shop = clickOrder.vendorName;
		$scope.orderId = clickOrder.orderId;
		$scope.orderStatus = clickOrder.orderStatus;

        angular.element('#orderItemModal').modal('show');
    };

    $scope.setTooltip = function() {
        $('.order_row').tooltip({
            placement: 'bottom',
            delay: {
                hide: 0,
                show: 500
            }
        });
    };

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        dataFactory.uploadFileToUrl(file);
    };

    $scope.downloadShopItem = function(fileName) {
    	dataFactory.downloadShopItem(fileName)
            .then(function(success) {
                console.log('success : ' + success);
            }, function(error) {
                console.log('error : ' + error);
            });
    };

    $scope.updateOrder = function(orderDtls){
        orderDtls.orderStatus = "Canceled";
        dataFactory.updateOrder(orderDtls)
            .success(function(data) {
                console.log(data);
                var title = "Error";
                if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
                    title = "Succes";
                }
                $mdDialog.show($mdDialog
                    .alert()
                    .title(title)
                    .textContent(data.statusText)
                    .ok('Okay')
                );
            })
            .error(function(error) {
                //console.log(error);
            });
    };
});
