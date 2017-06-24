var app = angular.module('bringGroceryApp');
app.controller('serviceReqCtrl', function ($scope,$location,$http,dataFactory,ngToast,groceryService,$rootScope) {
	var me=this;
	$scope.activityList=[];
	$scope.IsVisible = false;
	$scope.IsActivityVisible=true;
	$scope.isEdited=true;
    $scope.address = {};
    $scope.updateFlag = false;
    $scope.rc.addressAvailable = false;
    $scope.showEditAddr = false;
    $scope.firstTime=false;
    $scope.existingAddress = {};
    $scope.address = {};
    $scope.init = function() {
    	 $scope.getAddress();
    };

    $scope.getAddress = function() {
        promise = groceryService.retriveCustomerAddress($rootScope.getCookieData("custId"));
        promise.then(function(data) {
            if(data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS){
	                $scope.rc.addressAvailable = true;
	                $scope.existingAddress = data.data;
	                $scope.showEditAddr = true;
					$scope.address = JSON.parse(JSON.stringify($scope.existingAddress));
				} else {
	                $scope.rc.addressAvailable = false;
	                $scope.showEditAddr = false;
	                $scope.isEdited=false;
				}
        });
    };

    $scope.saveServiceOrderDtls = function(serviceDtls) {
//    	alert("submitting request");
    	var store = $rootScope.getCookieData('storedetail');
    	$scope.address.addressId = $scope.existingAddress.addressId;
    	$scope.address.city="Pune";
        $scope.address.state="Maharashtra";
        $scope.address.country="India";
        var orderDetails = {
        		"custId" : $rootScope.getCookieData("custId"),
        		"addressCriteria" : $scope.address,
        		"category" : store.category,
        		"speciality":$scope.speciality_id,
        		"activity":$scope.activity_id,
        		"customActivity":$scope.activityDetails,
        		"vendorId":store.storeId,
        		"vendorName":store.name,
        		"vendorMobileNo":store.contactNo,
        		"orderStatus":"Placed",
        		"agree":"Y",
        		"customerType":"C",
            };
    	
        promise = dataFactory.saveServiceOrderDtls(orderDetails);
    	promise.then(function(orderData) {
        	//alert(orderData);
            if(orderData.data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS){
                //alert("got response from server success");
                $scope.rc.prePayData = orderData.data.data;
                $scope.rc.isPrePay = false;
                if(orderData.data.statusCode === 1) {
                    $scope.rc.paymentStatus = 1; // Success
                }
                else {
//                    alert("got response from server failed");
                    $scope.rc.paymentStatus = -1; // Failure
                    $scope.rc.errorMsg = orderData.statusText;
                }
                $location.path("successServicePg");
            } else {
            	alert("Error while sumbitting request");
            }
        });
    };

    $scope.editAddress = function() {
		$scope.isEdited=false;
        $scope.updateFlag = true;
        $scope.showEditAddr = false;
        $scope.rc.addressAvailable = false;
        $scope.address = JSON.parse(JSON.stringify($scope.existingAddress));
    };

    $scope.cancelUpdate = function() {
        $scope.rc.addressAvailable = true;
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    };

    $scope.updateAddress = function(address, isFormValid) {
    	//alert(isFormValid);
        if (!isFormValid) {
            return false;
        }
        address.country = 'India';
        address.custId = $rootScope.getCookieData("custId");
        /************ Just to solve error. Need to have only one API for both ADD and Update*****/
        promise = groceryService.saveCustomerAddress(address);
        promise.then(function(data) {
            $scope.existingAddress = address;
            $scope.rc.addressAvailable = true;
        });
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    };
    
    $scope.getActivity = function(specialityId)
    {
		dataFactory.getActivitys(specialityId)
	    .success(function(data) {
			if (data.statusCode === $scope.rc.CONST.STATUS_CODE_FAILED || data.statusCode === $scope.rc.CONST.STATUS_CODE_ERROR) {
				$mdDialog.show($mdDialog
					.alert()
					.title('ERROR!!')
					.textContent(data.statusText)
					.ok('Okay')
				);
			} else if (data.statusCode === $scope.rc.CONST.STATUS_CODE_SUCCESS) {
				$scope.activityList = data.data;
				$scope.IsVisible=false;
				$scope.IsActivityVisible=true;
				if(($scope.activityList[0].id) == '9999')
				{
					$scope.IsVisible=true;
					$scope.IsActivityVisible=false;
				}
			}
	    })
	    .error(function(error) {
	        console.log(error);
	    });
    };
});
