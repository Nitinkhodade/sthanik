var app = angular.module('bringGroceryApp');
app.controller('vendorOrderCtrl', function($scope, $location, dataFactory, $routeParams, $rootScope) {
    var me = this;
    $scope.init = function() {
    	$scope.orderHistory = [];
    	if (!$rootScope.getCookieData('authToken')) {
    		$location.path("/401");
    	}
    	$scope.getData();
    	me.orderList = false;
        $('.progress-bar').tooltip();
    };

    $scope.getData = function() {
    	//alert($rootScope.getCookieData("custId"));
        var promise_history = dataFactory.getVendorOrderData($rootScope.getCookieData("custId"),'Placed,Accepted');
        $scope.orderHistoryLoading = true;
        promise_history.success(function(data) {
            $scope.orderHistoryLoading = false;
            $scope.orderHistory = data.data;
        });
    };
    
    $scope.getDataPostOrder = function() {
//    	alert($rootScope.getCookieData("custId"));
        var promise_history = dataFactory.getVendorOrderData($rootScope.getCookieData("custId"),'Rejected,Delivered');
        $scope.orderHistoryLoading = true;
        promise_history.success(function(data) {
        	me.orderList = true;
            $scope.orderHistoryLoading = false;
            $scope.orderHistory = data.data;
        });
    };
    
    this.getOrderItemsData = function(orderId) {
    	var promise_history = dataFactory.getOrderItems(orderId);
        $scope.orderHistoryLoading = true;
        promise_history.success(function(data) {
            $scope.orderHistoryLoading = false;
            $scope.orderItems = data;
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
});
