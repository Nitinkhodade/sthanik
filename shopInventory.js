var app = angular.module('bringGroceryApp');
app.controller('shopInventoryCtrl', function($scope, $location, dataFactory, $rootScope) {
    var me = this;
    $scope.init = function() {
    	if (!$rootScope.getCookieData('authToken')) {
    		$location.path("/401");
    	}
    	me.getData();
    };

    this.getData = function() {
        var promise_inventory = dataFactory.getShopInventory("Groceries");
        promise_inventory.success(function(data) {
            $scope.shopInventory = data;
        });
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
    
});
