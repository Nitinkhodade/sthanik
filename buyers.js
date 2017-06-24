var app = angular.module('bringGroceryApp');

app.controller('buyersCtrl', function($scope, $location, dataFactory, $rootScope, $mdDialog) {

    var me = this,
        search = {
            vendorId: 0,
            payoutId: 0,
            orderId: 0,
            orderStatus: "",
            payMode: "",
            fromDate: "",
            toDate: ""
        };

    $scope.showDetails = false;

    $scope.init = function() {
        if (!$rootScope.getCookieData('authToken')) {
            $location.path("/401");
        }
        $scope.getBuyers();
    };

	$scope.getBuyers = function() {
		console.log("getBuyers called");
		dataFactory.getBuyers(search)
            .success(function(data) {
                console.log(data);
                if (data.statusCode === $scope.rc.CONST.STATUS_CODE_FAILED || data.statusCode === $scope.rc.CONST.STATUS_CODE_ERROR) {
                    $mdDialog.show($mdDialog
                        .alert()
                        .title('ERROR!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );
                } else if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
                    $scope.vendorList = data.data;
                    $scope.showDetails = true;
                }
            })
            .error(function(error) {
                console.log(error);
            });
	};

    $scope.search = function(searchData) {
		console.log(searchData);
        if (!searchData) {
            $mdDialog.show($mdDialog
                .alert()
                .title('ERROR!!')
                .textContent("Please select something to search")
                .ok('Okay')
            );
            return;
        }

        search = searchData;

        $scope.getBuyers();
    };

});
