var app = angular.module('bringGroceryApp');
app.controller('vendorRegCtrl', function($scope, $location, $http, $cookieStore,dataFactory,ngToast) {
    $('.close').trigger('click');
	$('.root-wrapper').attr('id', 'vendorreg-page');
    this.areaData = [];
    this.cityData = ['PUNE'];
    this.subAreaData = [];
    $scope.newVendor = {};

    $scope.submitVendorDetails = function(credentials,isValid) {
    	if(!isValid)
    		{
    			alert("form is invalid");
    			return false;
    		}
    	dataFactory.registerVendor(credentials)
        .success(function(data) {
        		$location.path('/regSuccess').search('data', data.data);
        })
        .error(function(error) {
            ngToast.create({
                className: 'danger',
                content:  data.statusText
              });
    		$location.path("/");
        });
    };

    this.onCitySelected = function() {
        var me = this,
            city = this.city,
            promise;

        if(!city){
            return;
        }
        $scope.newVendor.city=city;
        promise = dataFactory.getAreasByCity({'city': city});

        promise.success(function(data) {
            // var areaObj = data.data;
            me.areaData = data.data[0].areas;
        });
    };

    this.onAreaSelected = function() {
        var me = this,
            areaName = this.areaObj ? this.areaObj.areaName : '',
            promise;

        if(!areaName){
            return;
        }

        promise = dataFactory.getSubAreasByArea({'area':areaName});

        $scope.newVendor.area = areaName;
        promise.success(function(data) {
            // var areaObj = data.data;
            me.subAreaData = data.data;
        });
    };

    this.onSubAreaSelected = function() {
        var me = this,
            subAreaName = this.subArea,
            promise;

        if(!subAreaName){
            return;
        }

        $scope.newVendor.subArea = subAreaName;
    };

    this.cityQuerySearch = function() {
        return this.citySearchText ? this.cityData.filter( createCityFilterFor(this.citySearchText) ) : this.cityData;
    };

    this.areaQuerySearch = function() {
        return this.areaSearchText ? this.areaData.filter( createAreaFilterFor(this.areaSearchText) ) : this.areaData;
    };

    this.subAreaQuerySearch = function() {
        return this.subAreaSearchText ? this.subAreaData.filter( createSubAreaFilterFor(this.subAreaSearchText) ) : this.subAreaData;
    };

    function createAreaFilterFor(query, obj) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(area) {
        return (angular.lowercase(area.areaName).indexOf(lowercaseQuery) > -1);
      };
    }

    function createCityFilterFor(query, obj) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(city) {
        return (angular.lowercase(city).indexOf(lowercaseQuery) > -1);
      };
    }

    function createSubAreaFilterFor(query, obj) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(subArea) {
        return (angular.lowercase(subArea).indexOf(lowercaseQuery) > -1);
      };
    }
});
