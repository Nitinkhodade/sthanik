var app = angular.module('bringGroceryApp');
app.controller('manageInventoryCtrl', function($scope, $location, dataFactory, $routeParams, $rootScope) {
    var me = this;
    $scope.init = function() {
    	$scope.categoryItems = [];
    	$scope.categories = [];
    	$scope.selectCategory="Groceries";
    	$scope.filterCriteria="Groceries";
    	if (!$rootScope.getCookieData('authToken')) {
    		$location.path("/401");
    	}
    	$scope.getCategories();
    	me.orderList = false;
        $('.progress-bar').tooltip();
    };
    
    $scope.getCategories = function() {
    	//get all the category being served in sthanik.
        var promise_history = dataFactory.getCategories();
        $scope.flagLoading = true;
        promise_history.success(function(data) {
            $scope.flagLoading = false;
            $scope.categories = data;
        });
    };
    $scope.getCategoryItems = function() {
    	//pass category to get the items of the category.
    	
        var promise_history = dataFactory.getCategoryItems($scope.selectCategory);
        $scope.flagLoading = true;
        promise_history.success(function(data) {
            $scope.flagLoading = false;
            $scope.categoryItems = data;
		});
    };
	$scope.editItemOption = function(itemOption) {
		$scope.itemoption= itemOption;
		$scope.statusText="";
		$scope.showSuccessAlert=false;
	}
	$scope.addItemOption = function(itemDetails) {
	   // alert(itemDetails.shopOptions +" "+itemDetails.itemId);
		$scope.itemDetails = itemDetails;
		$scope.showSuccessAlert=false;
		//var itemOption = itemDetails.shopOptions[0];
		if(typeof itemDetails.shopOptions == 'undefined') {
			alert("empty"+itemDetails.itemId);
			$scope.itemDetails.shopOptions=[];
		}
		
		$scope.newItemOption = {
							 itemId : itemDetails.itemId,
							 optionId :0,
							 optionValue: '',
							 optionUnit: '',
							 mrp: '',
							 sprice: '',
							 discount: 0,
							 imageUrl: ''
							};
	}
	$scope.createItemOption = function() {
		 //alert($scope.itemoption.mrp +" "+ $scope.itemoption.sprice+" " +$scope.itemoption.itemId);
		var promise_history = dataFactory.createItemOption($scope.newItemOption);
        $scope.flagLoading = true;
        promise_history.success(function(data) {
			$scope.flagLoading = false;
			$scope.newItemOption.optionId = data.data;
			$scope.statusText = data.statusText;
			$scope.itemDetails.shopOptions.push($scope.newItemOption);
			$scope.showSuccessAlert = data.statusCode ==1 ? true : false;
           //alert($scope.showSuccessAlert);
        });
	}
	$scope.saveItemOption = function() {
		 
		//alert($scope.itemoption.mrp +" "+ $scope.itemoption.sprice+" " +$scope.itemoption.itemId);
		//dataFactory.updateItemOption();
		var promise_history = dataFactory.updateItemOption($scope.itemoption);
        $scope.flagLoading = true;
        promise_history.success(function(data) {
			$scope.flagLoading = false;
			$scope.statusText = data.statusText;
			$scope.showSuccessAlert = data.statusCode ==1 ? true : false;
           //alert($scope.showSuccessAlert);
        });
	}
    
    $scope.createItem = function() {
     // alert("add ITem");
	  //$scope.categoryItems.splice(0,0,$scope.newItem);
      var promise_history = dataFactory.createItem($scope.newItem);
        $scope.flagLoading = true;
        promise_history.success(function(data) {
        	$scope.flagLoading = false;
			$scope.newItem.itemId = data.data;
			$scope.statusText = data.statusText;
			$scope.categoryItems.unshift($scope.newItem);
			$scope.showSuccessAlert = data.statusCode ==1 ? true : false;
        });
    };
	
	$scope.addItem = function() {
	   $scope.showSuccessAlert=false;
	  // angular.element('#orderItemModal').modal('show');
       $scope.newItem ={
							 mainMenuId:'',
							 subMenuId:'',
							 mainMenuCategory:'',
							 subMenuCategory:'',
							 itemId :0,
							 itemName:'',
							 description:'',
							 imageUrl: '',
							 shopOptions:[]
					  };
	   // alert($scope.newItem.itemName)	;			
	}
    
    this.getOrderItemsData = function(orderId) {
    	var promise_history = dataFactory.getOrderItems(orderId);
        $scope.flagLoading = true;
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

   
});
