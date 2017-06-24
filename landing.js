/**
 * @ngdoc function
 * @name bringGroceryApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bringGroceryApp
 */
var app = angular.module('bringGroceryApp');

app.controller('LandingCtrl', function($scope, $location, groceryService, $http, $rootScope) {
    $scope.citySelected = "Select City";
    $scope.loc = {};
    $scope.loc.citySelected = "Select City";
    $scope.loc.categorySelected = "Category";
    $('.root-wrapper').attr('id', 'landing-page');
    /*** Start: Just for Json structure.. need to remove when backend API is ready ***/
    $scope.loc.categoryList = [{
        "id": 1,
        "name": "Groceries"
    }, {
        "id": 3,
        "name": "Furniture"
    }, {
        "id": 4,
        "name": "Medicals"
    }, {
        "id": 5,
        "name": "Textiles"
    }];
    /********* END ********************************************************************/

    var removeListener = $scope.$on('areaCodesRendered', function(event) {
        var area = $rootScope.getCookieData('areadetail');
        if (area && $('*[val="'+ area.locationName + ',' + area.areaName +'"]','.area-codes').length) {
            event.currentScope.lc.setArea(area.locationName + ',' + area.areaName);
        }
        removeListener();
    });
    this.init = function() {
        var me = this,
            cityName = $rootScope.getCookieData('cityName'),
            promise_city_list = groceryService.getCityList();
        me.citysLoading=true;
        promise_city_list.then(function(cities) {
            $scope.loc.locationList = cities;
            me.citysLoading=false;
            if(cities.length === 1){
                me.setCurrentCity(cities[0]);
            } else if (cityName && ~cities.indexOf(cityName)){
                me.setCurrentCity(cityName);
            }
        });
    };

    this.setCurrentCity = function(cityName) {
        /***** TODO: make a service call and pull areas and zips ***/
        $scope.loc.citySelected = cityName;
        $scope.loc.showCity = false;
        $rootScope.updateCookieData('cityName', cityName);
        this.getAreaList(cityName);
    };
    this.setCategory = function(categoryId, category) {
        /***** TODO: make a service call and pull areas and zips ***/
        $scope.loc.categorySelected = category;
        $scope.loc.showCategory = false;
        $rootScope.updateCookieData('category', category);
        this.browseGrosery($rootScope.getCookieData('areadetail').areaId, category);
    };

    this.setCurrentArea = function(area) {
        $rootScope.updateCookieData('areadetail', area);
        this.setArea(area.locationName + ',' + area.areaName);
    };

    this.setArea = function(areaName) {
        if(!areaName && $rootScope.getCookieData('areadetail')){
            area = $rootScope.getCookieData('areadetail');
            areaName = area.locationName + ',' +area.areaName;
        }
        this.query = areaName;
        $('.area-codes').hide();
    };

    this.cleanAreaSearchBar = function() {
        this.query = '';
    };

    this.browseGrosery = function(areaId, category) {
        areaId = areaId || $rootScope.getCookieData('areadetail').areaId;
        category = category || $rootScope.getCookieData('category');
        $rootScope.updateCookieData('category', category);
        $location.path("stores/a/" + areaId + "/" + category+"/api");
    };

    this.getAreaList = function(cityName) {
        var me = this,
            promise = groceryService.loadAreas(cityName);
        me.cleanAreaSearchBar();
        me.noareas = false;
        $scope.loc.areaList=[];
        me.areasLoading=true;
        promise.then(function(data) {
            me.areasLoading=false;
            $scope.loc.areaList = data;
            if(data.length===0){
                me.noareas = true;
            }
        });
    };

    this.removeAreaSelection = function() {
        this.query = '';
        $rootScope.deleteCookieData('areadetail');
    };

    this.toggleGuess = function() {
        if (this.query){
            $('.area-codes').show();
        }
        else {
            $('.area-codes').hide();
        }
    };

    this.hasSelection = function(){
        if($scope.rc.hasAreaSelection()){
            area = $rootScope.getCookieData('areadetail');
            return this.query === (area.locationName + ',' + area.areaName);
        }
        return false;
    };
});
