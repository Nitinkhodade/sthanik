/**
 * @ngdoc overview
 * @name bringGroceryApp
 * @description
 * # bringGroceryApp
 *
 * Main module of the application.
 */


var app = angular.module('bringGroceryApp', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngToast',
  'ngMaterial'
]);

app.config(function($routeProvider, $locationProvider, $httpProvider) {

 $httpProvider.interceptors.push('authInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'common/views/landing.html',
      controller: 'LandingCtrl',
      controllerAs: 'lc',
    //   css: 'css/landing.css'
    })
    .when('/stores/a/:areaId/:category/:api?', {
      templateUrl: 'common/views/stores.html',
      controller: 'StoresCtrl',
      controllerAs: 'stc',
    //   css: 'css/stores.css'
    })
    .when('/service/request', {
      templateUrl: 'common/views/serviceRequest.html',
      controller: 'serviceReqCtrl',
      controllerAs: 'srvReqCtrl',
    })
    .when('/stores/:category', {
      templateUrl: 'common/views/stores.html',
      controller: 'StoresCtrl',
      controllerAs: 'stc',
    //   css: 'css/stores.css'
    })
    .when('/shop/s/:storeId/:category/:storeName?', {
      templateUrl: 'common/views/shop.html',
      controller: 'ShopCtrl',
      controllerAs: 'sc',
    //   css: 'css/shop.css'
    })
	.when('/shop/:searchInput', {
      templateUrl: 'common/views/shop.html',
      controller: 'ShopCtrl',
      controllerAs: 'sc',
    //   css: 'css/shop.css'
    })
    .when('/checkout', {
      templateUrl: 'common/views/checkout.html',
      controller: 'checkoutCtrl',
      controllerAs:'cc',
    //   css: 'css/checkout.css'
    })
    .when('/successServicePg', {
      templateUrl: 'common/views/serviceSuccess.html',
      controller: 'serviceSuccessCtrl',
      controllerAs:'servSucesCtrl',
    //   css: 'css/checkout.css'
    })
    .when('/updatePwd', {
      templateUrl: 'common/views/resetPwd.html',
      controller: 'resetPwdCtrl',
      controllerAs: 'resetPwd'
    })
    .when('/orderHistory', {
      templateUrl: 'common/views/orderHistory.html',
      controller: 'orderHistoryCtrl',
      controllerAs: 'orderHistory'
    //   css:'css/orderHistory.css'
    })
    .when('/profile',{
        templateUrl: 'common/views/userProfile.html',
        controller: 'userProfileCtrl',
        controllerAs: 'profileCtrl'
    })
    .when('/regVendor',{
        templateUrl: 'common/views/vendorSignUp.html',
        controller: 'vendorRegCtrl',
        controllerAs: 'vRegCtrl'
    })
    .when('/shopInventory',{
        templateUrl: 'common/views/shopInventory.html',
        controller: 'shopInventoryCtrl',
        controllerAs: 'shopInvCtrl'
    })
    .when('/verifyEmail', {
      templateUrl: 'common/views/emailVerify.html',
      controller: 'emailVerifyCtrl',
      controllerAs: 'emailVerify'
    })
    .when('/support', {
      templateUrl: 'common/views/support.html'
    })
    .when('/aboutus', {
      templateUrl: 'common/views/aboutus.html'
    })
    .when('/contactUs', {
      templateUrl: 'common/views/contactUs.html',
      controller: 'contactUsCtrl',
      controllerAs: 'contact'
    })
    .when('/shopItemExpImp', {
      templateUrl: 'common/views/shopItemExportImport.html',
      controller: 'shopItemExportImportCtrl',
      controllerAs: 'shopItemExpImp'
    })
    .when('/vendorOrder', {
      templateUrl: 'common/views/vendorOrder.html',
      controller: 'vendorOrderCtrl',
      controllerAs: 'voc'
    })
    .when('/terms', {
      templateUrl: 'common/views/terms.html'
    })
    .when('/policy', {
      templateUrl: 'common/views/privacyPolicy.html'
    })
    .when('/completeOrder', {
      templateUrl: 'common/views/completeOrder.html',
      controller: 'completeOrderCtrl',
      controllerAs: 'co'
    })
    .when('/createPayout', {
      templateUrl: 'common/views/createPayout.html',
      controller: 'createPayoutCtrl',
      controllerAs: 'payoutC'
    })
    .when('/searchPayout', {
      templateUrl: 'common/views/searchPayout.html',
      controller: 'searchPayoutCtrl',
      controllerAs: 'payoutS'
    })
	
    .when('/buyers', {
      templateUrl: 'common/views/buyers.html',
      controller: 'buyersCtrl',
      controllerAs: 'buyersS'
    })
    .when('/manageInventory', {
      templateUrl: 'common/views/manageInventory.html',
      controller: 'manageInventoryCtrl',
      controllerAs: 'miCtrl'
    })
    .when('/regSuccess', {
      templateUrl: 'common/views/regSuccess.html',
      controller: 'vndrRegSucsCtrl',
      controllerAs: 'vndrRegSucsCtrl'
    })
    .when('/401',{
    	templateUrl:'/401.html',
    	controller: function(){
            setTimeout(function(){
              window.location = '/';
            },5000);
          },
        //   css:'css/fourO4.css'
    })
    .otherwise({
    //   redirectTo: '/'
      templateUrl: '404.html',
      controller: function(){
        setTimeout(function(){
          window.location = '/';
        },3000);
      },
    //   css:'css/fourO4.css'

    });
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix();
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
});

app.config(['ngToastProvider', function(ngToast) {
  ngToast.configure({
    verticalPosition: 'right',
    horizontalPosition: 'center',
    dismissButton: true,
    maxNumber: 1
  });
}]);


app.run(function run( $http, $cookies ){
	$http.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
	$http.defaults.xsrfCookieName = 'CSRF-TOKEN';
	});

app.config(['$httpProvider', function($httpProvider) {
    function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e16]+1e16).replace(/[01]/g,b)};

    $httpProvider.interceptors.push(function() {
        return {
            'request': function(response) {
                document.cookie = 'CSRF-TOKEN=' + b();
                return response;
            }
        };
    });
}]);

app.run(function($rootScope) {
  $rootScope.showLoading = false;
  $rootScope.getCookieData = function(itemKey, cookiesKey) {
    var data = {};
    cookiesKey = cookiesKey || 'sthanikData';
    if (typeof Storage !== 'undefined') {
      if (cookiesKey in localStorage) {
        data = JSON.parse(localStorage.getItem(cookiesKey)) || {}; //get from local storage.
      }
    } else {
      // All modren browsers support this but better to check once should not come here
      alert("oops!! use latest versioned browsers");
    }
    return itemKey ? data[itemKey] : data;
  };
  $rootScope.updateCookieData = function(itemKey, value, cookiesKey) {
    var data = $rootScope.getCookieData() || {};
    cookiesKey = cookiesKey || 'sthanikData';
    if (typeof Storage !== 'undefined') {
      if (itemKey && value) {
        data[itemKey] = value;
      }
      localStorage.setItem(cookiesKey, JSON.stringify(data));
    } else {
      // All modren browsers support this but better to check once should not come here
      alert("oops!! use latest versioned browsers");
    }
  };
  $rootScope.deleteCookieData = function(itemKey, cookiesKey) {
    cookiesKey = cookiesKey || "sthanikData";
    var data = $rootScope.getCookieData() || {};
    if (typeof Storage !== 'undefined') {
      if (itemKey) {
        delete data[itemKey];
        localStorage.setItem(cookiesKey, JSON.stringify(data));
      } else {
        localStorage.removeItem(cookiesKey);
      }
    } else {
      // All modren browsers support this but better to check once should not come here
      alert("oops!! use latest versioned browsers");
    }
  };
});
