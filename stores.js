var app = angular.module('bringGroceryApp');
app.controller('StoresCtrl', function($scope, $rootScope, $location, dataFactory, $routeParams, shoppingCart, $mdDialog) {
    var me = this;
    $scope.$parent.redirectForLoaction();
    $scope.init = function() {
        var areaId,
            category,api;
        //   $scope.stores = $rootScope.getCookieData('storedetail') || {};
        $scope.cityName = $rootScope.getCookieData('cityName') || {};
        $scope.selectedArea = $rootScope.getCookieData('areadetail') || {};
        $scope.selectedCategory = $rootScope.getCookieData('category') || '';
        areaId = $routeParams.areaId || $scope.selectedArea.areaId;
        category = $routeParams.category || $scope.selectedCategory;
        api = $routeParams.api;
        me.getStoresByAreaId(areaId,category,api);
        //alert($routeParams.testAPI);
        // $('.root-wrapper').attr('id', 'store-page');
    };
    // To get list of stores of selected area
    this.getStoresByAreaId = function(areaId, category,api) {
        if(!areaId || !category){
            $location.path('/');
        }
        $scope.storesLoading = true;
        var promiseStore = dataFactory.getAreaStores(areaId, 'All',api);//(areaId, category);
        promiseStore.success(function(data) {
            $scope.storesLoading = false;
            $scope.stores = data.data;
            //me.setCurrentStore();
        });
        promiseStore.error(function(error) {
            $scope.storesLoading = false;
            $scope.status = 'Unable to load category product: ' + error.message;
        });
    };

    /*************** Class Methods ******************/
    this.setCurrentStore = function(store) {
        var s = store || $rootScope.getCookieData('storedetail') || $scope.stores[0]; // setting default to first store
        $scope.rc.selectedStore = s.name;
        $rootScope.updateCookieData('storedetail', s);
        this.processStoreChange(s);
        // $rootScope.$broadcast("loadProductsByStore", s.storeId);
//        window.location = "shop/s/" + s.storeId;
        //var locationOfShop =
        var shopName = s.name.replace(/ /g, '_');
        var category= s.category.replace(' ','_');
        $scope.rc.category=category;
        
        if(!category.includes("Services"))
        {
        $location.path("shop/s/" + s.storeId+"/"+category+"/"+shopName);
        }
        else
        {
    		dataFactory.getSpeciality("Electrical")
    	    .success(function(data) {
    	        //console.log(data);
    			if (data.statusCode === $scope.rc.CONST.STATUS_CODE_FAILED || data.statusCode === $scope.rc.CONST.STATUS_CODE_ERROR) {
    				$mdDialog.show($mdDialog
    					.alert()
    					.title('ERROR!!')
    					.textContent(data.statusText)
    					.ok('Okay')
    				);
    			} else if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
    				$scope.rc.specialityList = data.data;
    			}
    	    })
    	    .error(function(error) {
    	        console.log(error);
    	    });
        	$location.path("/service/request");
        }
    };

    this.processStoreChange = function(newStore) {
        shoppingCart.setStore(newStore);
        shoppingCart.syncItems();
        $scope.rc.resetCart();
    };
});
