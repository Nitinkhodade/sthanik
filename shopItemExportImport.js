var app = angular.module('bringGroceryApp');
app.controller('shopItemExportImportCtrl', function($scope, $location, dataFactory, $routeParams, $rootScope) {
    var me = this;
    $scope.init = function() {
    	if (!$rootScope.getCookieData('authToken')) {
    		$location.path("/401");
    	}
    	//me.getData();
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
//    	alert("uploading a file");
        var file = $scope.myFile;
        var promise_items = dataFactory.uploadFileToUrl(file);
        promise_items.success(function(data) {
        $scope.importResult = data;
          //  $scope.shopItems = data;
//        	alert('Data'+$scope.importResult.shopItems.length);
        });
        promise_items.error(function(data) {
            
              //  $scope.shopItems = data;
            	alert('error'+data);
            });
       
    };
    $scope.importData = function() {
    	//alert($rootScope.getCookieData('authToken'));
    	//alert("TrackId"+$scope.importResult.trackId);
        var promise_importData = dataFactory.importData($scope.importResult.trackId);
        promise_importData.success(function(data) {
            $scope.message = data;
            //alert('Success'+$scope.message);
        });
        promise_importData.error(function(data) {
            $scope.message = data;
            //alert('ERROR'+$scope.message);
        });
    };
    
    $scope.downloadShopItem = function(fileName) {
    	dataFactory.downloadShopItem($rootScope.getCookieData('custId'))
            .then(function(success) {
                console.log('success : ' + success);
            }, function(error) {
                console.log('error : ' + error);
            });
    };
    
});
