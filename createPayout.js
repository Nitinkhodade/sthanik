var app = angular.module('bringGroceryApp');

app.controller('createPayoutCtrl', function($scope, $location, dataFactory, $rootScope, $mdDialog, $filter) {

    var me = this,
        search = {
            vendorId: 0,
            orderStatus: "Delivered",
            payMode: "",
            fromDate: "",
            toDate: ""
        };

	initSum();

    $scope.init = function() {
        if (!$rootScope.getCookieData('authToken')) {
            $location.path("/401");
        }

		dataFactory.getVendors()
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

	function initSum() {
		$scope.sumOrderTotal = 0;
        $scope.sumCODTotal = 0;
        $scope.sumPayOnlineTotal = 0;
        $scope.sumDiscountTotal = 0;
        $scope.sumServiceChargeTotal = 0;
		$scope.sumAmountPayable = 0;
	};

    $scope.getVendorOrders = function(dtls) {

        if (angular.isUndefined(dtls.vendorId)) {
            $mdDialog.show($mdDialog
                .alert()
                .title('Alert!!')
                .textContent("Please select vendor name")
                .ok('Okay')
            );
            return;
        }

/*
        if (angular.isUndefined(dtls.fromDate)) {
            $mdDialog.show($mdDialog
                .alert()
                .title('Alert!!')
                .textContent("Please enter from date")
                .ok('Okay')
            );
            return;
        }

        if (angular.isUndefined(dtls.toDate)) {
            $mdDialog.show($mdDialog
                .alert()
                .title('Alert!!')
                .textContent("Please enter to date")
                .ok('Okay')
            );
            return;
        }
*/
        //console.log(dtls.accountingPeriod);
		if (angular.isUndefined(dtls.accountingPeriod)) {
            $mdDialog.show($mdDialog
                .alert()
                .title('Alert!!')
                .textContent("Please select accounting period")
                .ok('Okay')
            );
            return;
        }
		search.vendorId = dtls.vendorId;
        search.fromDate = $filter('date')(dtls.accountingPeriod.dateStart, "yyyy-MM-dd");
        search.toDate = $filter('date')(dtls.accountingPeriod.dateEnd, "yyyy-MM-dd");

        console.log(search);

        initSum();

        dataFactory.searchVendorOrders(search)
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
					$scope.orderList = data.data;
					for (var i in $scope.orderList) {
						$scope.sumOrderTotal += $scope.orderList[i].grandTotal;
						if ($scope.orderList[i].payMode === "COD") {
							$scope.sumCODTotal += $scope.orderList[i].grandTotal;
						} else if ($scope.orderList[i].payMode === "PAY_NOW") {
							$scope.sumPayOnlineTotal += $scope.orderList[i].grandTotal;
						}
						$scope.sumDiscountTotal += $scope.orderList[i].discount;
						$scope.sumServiceChargeTotal += $scope.orderList[i].vendorServiceCharge;
						$scope.sumAmountPayable += $scope.orderList[i].amountPayable;
					}
				}
            })
            .error(function(error) {
                console.log(error);
            });
    };

	$scope.updateAdjustment = function(adjustmentDetail) {
		console.log(adjustmentDetail);
		dataFactory.updateAdjustment(adjustmentDetail)
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
                    $mdDialog.show($mdDialog
                        .alert()
                        .title('SUCCESS!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );
                    adjustmentDetail.approved = 'Y';
                }
            })
            .error(function(error) {
                console.log(error);
            });
	}

	$scope.update = function(orderDtls) {
		console.log(orderDtls);
		dataFactory.updateOrderForPayout(orderDtls)
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
                    $mdDialog.show($mdDialog
                        .alert()
                        .title('SUCCESS!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );
					orderDtls.readyForPayout = 'Y';
                }
            })
            .error(function(error) {
                console.log(error);
            });
	}

	$scope.adjust = function(orderDtls) {

		var amount1=prompt('Enter Amount for manual adjustment');
		if(amount1 == null || amount1.trim().length === 0){
			$mdDialog.show($mdDialog
							.alert()
							.title('ERROR!!')
							.textContent("Please enter amount to adjust")
							.ok('Okay')
						);
			return;
		}
		var amount2=prompt('Please confirm Amount for manual adjustment');
		if(amount2 == null || amount2.trim().length === 0){
			$mdDialog.show($mdDialog
							.alert()
							.title('ERROR!!')
							.textContent("Please Confirm amount to adjust")
							.ok('Okay')
						);
			return;
		}

		if(amount1 != amount2) {
			$mdDialog.show($mdDialog
							.alert()
							.title('ERROR!!')
							.textContent("Initial & confirmed amount does not match, please check")
							.ok('Okay')
						);
			return;
		}

		orderDtls.amountPayable=amount1;

		console.log(orderDtls);
		dataFactory.adjustOrderForPayout(orderDtls)
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
                    $mdDialog.show($mdDialog
                        .alert()
                        .title('SUCCESS!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );
					orderDtls.amountAdjusted = (parseFloat(orderDtls.amountAdjusted) + parseFloat(amount1));
                } else {
					$mdDialog.show($mdDialog
                        .alert()
                        .title('Fail!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );
				}
            })
            .error(function(error) {
                console.log(error);
            });
	}

	$scope.viewAdjustments = function(orderDtls) {
		console.log(orderDtls);
		dataFactory.viewAdjustments(orderDtls)
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
                    $scope.rc.adjustmentDetails = data;
                	$('#viewAdjustmentModel').modal('show');
                    /*$mdDialog.show($mdDialog
                        .alert()
                        .title('SUCCESS!!')
                        .textContent(data.statusText)
                        .ok('Okay')
                    );*/
					console.log(data.data);
                }
            })
            .error(function(error) {
                console.log(error);
            });
	}

    $scope.createPayoutRequest = function() {
        console.log(search);
		if (angular.isUndefined($scope.orderList) || $scope.orderList.length < 1 || search.vendorId === 0) {
			$mdDialog.show($mdDialog
						.alert()
						.title('ERROR!!')
						.textContent('No orders are there to create payout')
						.ok('Okay')
					);
			return;
		}


        dataFactory.createPayout(search)
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
					$mdDialog.show($mdDialog
						.alert()
						.title('SUCCESS!!')
						.textContent(data.statusText)
						.ok('Okay')
					);
				}
            })
            .error(function(error) {
                console.log(error);
            });
    };

});
