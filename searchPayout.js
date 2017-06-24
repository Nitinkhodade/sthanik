var app = angular.module('bringGroceryApp');

app.controller('searchPayoutCtrl', function($scope, $location, dataFactory, $rootScope, $mdDialog, $filter) {

    var me = this,
        search = {
            vendorId: 0,
            payoutId: 0,
            orderId: 0,
            orderStatus: "Delivered",
            payMode: "",
            fromDate: "",
            toDate: "",
            payoutStatus : ""
        };

    $scope.showDetails = false;

    $scope.showDetailsPayoutId = 0;

    $scope.init = function() {
        if (!$rootScope.getCookieData('authToken')) {
            $location.path("/401");
        }
        dataFactory.getVendors()
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
                }
            })
            .error(function(error) {
                console.log(error);
            });

		dataFactory.getAccountingPeriods(search)
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
                    //$scope.vendorList = data.data;
					$scope.accountingPeriods = data.data;
                }
            })
            .error(function(error) {
                console.log(error);
            });
    };
    //payout.payoutId
    $scope.updatePayout = function(payout,status) {
            search.payoutId = payout.payoutId;
            search.payoutStatus = status;
            //console.log(id);
            // TODO for Chaitanya, we need to replace this prompt with some better and generic alternative
            var remarks=prompt('Enter Remarks');

            if(remarks == null || remarks.trim().length === 0){
                $mdDialog.show($mdDialog
                                .alert()
                                .title('ERROR!!')
                                .textContent("Please enter remarks")
                                .ok('Okay')
                            );
                return;
            }
            search.customField1 = remarks.trim();
            dataFactory.updatePayout(search)
                .success(function(data) {
                    //console.log(data);
                    var title = "Error";
                    if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
                        title = "Succes";

                        //if success, then just refresh current search results
                        $scope.search($scope.dtls);
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

    $scope.fetchDetails = function(id) {
        search.payoutId = id;
        //console.log(id);
        dataFactory.getPayoutDetails(search)
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
                    //$scope.payoutList = data.data;
					console.log(data.data);
                    $scope.showDetails = true;
                    $scope.showDetailsPayoutId = search.payoutId;
                    $scope.payoutDetails = data.data;
                }
            })
            .error(function(error) {
                //console.log(error);
            });
    };

    $scope.search = function(searchData) {

        if (!searchData) {
            $mdDialog.show($mdDialog
                .alert()
                .title('ERROR!!')
                .textContent("Please select something to search")
                .ok('Okay')
            );
            return;
        }

		console.log(searchData);

		if(typeof searchData.accountingPeriod !== 'undefined'){
			searchData.fromDate = $filter('date')(searchData.accountingPeriod.dateStart, "yyyy-MM-dd");
			searchData.toDate = $filter('date')(searchData.accountingPeriod.dateEnd, "yyyy-MM-dd");
		}

        dataFactory.searchPayout(searchData)
            .success(function(data) {
                //console.log(data);
                if (data.statusCode === $scope.rc.CONST.STATUS_CODE_FAILED || data.statusCode === $scope.rc.CONST.STATUS_CODE_ERROR) {
                    $mdDialog.show($mdDialog
                        .alert()
                        .title('ERROR!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );
                    $scope.showResults = false;
                } else if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
                    if (data.data.length > 0) {
                        $scope.payoutList = data.data;
                        $scope.showResults = true;
                    }
                }
            })
            .error(function(error) {
                //console.log(error);
            });
    };


	$scope.printPayout = function(payout) {
		window.open('report/payout?payoutId='+payout.payoutId);
    };

});
