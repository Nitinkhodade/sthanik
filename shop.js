var app = angular.module('bringGroceryApp');
app.controller('ShopCtrl', function($scope, $rootScope, $location, dataFactory, $routeParams, ngToast, $mdDialog) {
    var me = this,
        pageCounter = 0,
        productsToLoad = 50;

    $scope.$parent.redirectForLoaction();

    $scope.init = function() {
        var default_storeId = $rootScope.getCookieData('storedetail') ? $rootScope.getCookieData('storedetail').storeId : 0;
        storeId = $routeParams.storeId || default_storeId;
        /*************** $scope initializations  ******************/
        $scope.productId = $routeParams.productId;
        $scope.brand = [];
        $scope.availIn = [];
        $scope.selection = [];
        $scope.breadcrum = [];
        $scope.sc.products = [];
        $scope.store = $rootScope.getCookieData('storedetail') || {};
        $scope.storeId = storeId;
        $scope.rc.selectedStore = $scope.store.name || 'Select Store';
        $scope.selectedArea = $rootScope.getCookieData('areadetail') || {};
        $scope.searchInput = $routeParams.searchInput || $rootScope.searchInput || 0;
        $scope.category = $routeParams.category || $rootScope.getCookieData('storedetail').category;
        $scope.defaultFilterData = true;
        me.bindEvents();
        me.getRequiredData();
        $scope.getProductsByStoreId(storeId);
        $('.root-wrapper').attr('id', 'shop-page');
    };
    /****************** Events *********************/
    this.bindEvents = function() {
        $rootScope.$on("loadProductsByStore", function(event, storeId) {
            $scope.getProductsByStoreId(storeId);
        });
    };
    /*************** promises binds ******************/
    this.getRequiredData = function() {
        var promise_menu = dataFactory.getMenu($scope.category);
        //    promise_category_product = dataFactory.getCategoryProduct();
        promise_menu.success(function(data) {
            $scope.menuItem = data.data;
        });
        promise_menu.error(function(error) {
            $scope.status = 'Unable to load Menu data: ' + error.message;
        });
    };

    this.loadMore = function(isFreshList) {
        if (!$scope.sc.allProducts) {
            return;
        }
        if (isFreshList) {
            pageCounter = 1;
            $scope.sc.products = [];
            var nextProductsSet = $scope.sc.allProducts;
            $scope.sc.products = $scope.sc.products.concat(nextProductsSet);
            return;
        }
        var frm = productsToLoad * pageCounter,
            to = productsToLoad * ++pageCounter,
            successFn = function(data) {
                var nextProductsSet = data.data;
                $scope.setContentLoading(false);
                if(nextProductsSet && nextProductsSet.length > 0){
                    $scope.sc.products = $scope.sc.products.concat(nextProductsSet);
                }
            },
            failureFn = function(error) {
                $scope.setContentLoading(false);
                $scope.status = 'Unable to load product data: ' + error.message;
            };
        if ($scope.defaultFilterData) {
            //call default filter
            //alert("calling default filter");
            var promise_category_product;
            promise_category_product = dataFactory.getProductListByStore($scope.storeId, $scope.searchInput, frm, productsToLoad);
            $scope.setContentLoading(true);
            promise_category_product.success(successFn);
            promise_category_product.error(failureFn);

        } else {
            //call filter data
            var filterdata = $scope.menuFilterData + "/" + frm + "/" + productsToLoad;
            //alert("calling menu filter"+filterdata);
            //alert(filterdata);
            $scope.setContentLoading(true);
            dataFactory.getFilteredProduct(filterdata).success(successFn).error(failureFn);
        }
    };

    $scope.getProductsByStoreId = function(storeId) {
        var promise_category_product;

        if (storeId) {
            promise_category_product = dataFactory.getProductListByStore(storeId, $scope.searchInput, 0, productsToLoad);
            $scope.setContentLoading(true);
            promise_category_product.success(function(data) {
                $scope.setContentLoading(false);
                $scope.sc.allProducts = data.data;
                $scope.defaultFilterData = true;
                $scope.sc.loadMore(true);
            });
            promise_category_product.error(function(error) {
                $scope.setContentLoading(false);
                $scope.status = 'Unable to load category product: ' + error.message;
            });
        }
    };

    this.changeStore = function() {
        $location.path("stores/a/" + $scope.selectedArea.areaId + '/' + $scope.category);
    };

    this.setProductCurrentOption = function(index, selectedOption) {
        // if(selectedOption.optionUnit.toUpperCase() === 'COMBO'){
        //     $('#splOptionItemModel').modal('show');
        // } else {
        var product = $scope.sc.products[index];
        product.itemId = selectedOption.optionId;
        product.mrp = selectedOption.mrp;
        product.sprice = selectedOption.sprice;
        product.availIn = selectedOption.optionValue + selectedOption.optionUnit;
        // }
    };

    this.getProductByBreadcrum = function(id, index) {
        var promise_getfilter_by_id;
        $scope.selectedProduct = id;
        this.removeBreadcrum(index);
        this.applyFilter();
        // promise_getfilter_by_id = dataFactory.getFilter(id);
        // promise_getfilter_by_id.success(function(data) {
        //   $scope.populaterFilter = data;
        // });
        // promise_getfilter_by_id.error(function(error) {
        //   $scope.status = 'Unable to load filter product data: ' + error.message;
        // });
    };
    this.getProduct = function(level1, level2, level3) {
        this.addBreadcrum(level1, level2, level3);
        this.applyFilter();
        window.scroll('top', 0);
        //call filter service to get filter data
        // dataFactory.getFilter(id)
        //   .success(function(data) {
        //     $scope.populaterFilter = data;
        //   })
        //   .error(function(error) {
        //     $scope.status = 'Unable to load filter product data: ' + error.message;
        //   });
    };
    this.brandFilter = function(filter) {
        var idx = $scope.brand.indexOf(filter);

        // is currently selected
        if (idx > -1) {
            $scope.brand.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.brand.push(filter);
        }

        this.applyFilter();
    };
    this.availInFilter = function(filter) {
        var idx = $scope.availIn.indexOf(filter);
        if (idx > -1) {
            $scope.availIn.splice(idx, 1);
        } else {
            $scope.availIn.push(filter);
        }

        this.applyFilter();
    };

    this.applyFilter = function() {
        //call service to apply filter

        var filterdata;
        var filterbrand;
        var filteravailInd;
        var mydata = [];
        angular.forEach($scope.brand, function(value, index) {
            mydata.push({
                type: 'Brand',
                value: value
            });
            if (index === 0) {

                filterbrand = value;
            } else {
                filterbrand = filterbrand + "--" + value;
            }

        });
        angular.forEach($scope.availIn, function(value, index) {
            if (index === 0) {
                filteravailInd = value;
            } else {
                filteravailInd = filteravailInd + "--" + value;
            }

        });
        $scope.searchInput = 0;
        $scope.rc.searchInput = "";
        filterdata = $scope.selectedProduct + "/" + (!filterbrand ? 0 : filterbrand) + "/" + (!filteravailInd ? 0 : filteravailInd) + "/" + $scope.storeId + "/" + $scope.searchInput;
        $scope.menuFilterData = filterdata;
        filterdata = filterdata + "/" + 0 + "/" + productsToLoad;
        //alert(filterdata);
        $scope.setContentLoading(true);
        $scope.$root.showLoading = true;
        dataFactory.getFilteredProduct(filterdata)
            .success(function(result) {
                $scope.setContentLoading(false);
                $scope.sc.allProducts = result.data;
                $scope.defaultFilterData = false;
                $scope.sc.loadMore(true);
            })
            .error(function(error) {
                $scope.setContentLoading(false);
                $scope.status = 'Unable to load product data: ' + error.message;
            });
    };

    this.removeBreadcrum = function(index) {
        var length = $scope.breadcrum.length - 1;
        for (var i = length; i > index; i--) {
            $scope.breadcrum.splice(i, 1);
        }
    };

    this.addBreadcrum = function(level1, level2, level3) {
        $scope.breadcrum = [];
        var args = Array.apply(this, arguments);
        args.forEach(function(level, index) {
            var levelObj;
            if (level) {
                levelObj = {
                    menuId: level.id,
                    menuName: level.menuName
                };
                $scope.breadcrum.push(levelObj);
                $scope.selectedProduct = level.id;
            }
        });
    };

    this.showSubMenu = function($event, item) {
        var menu = $($event.currentTarget),
            subMenu, body, subMenuBounds, offset;

        if (!menu.hasClass('dropdown')) {
            return;
        }
        subMenu = menu.children("ul.dropdown-menu");
        subMenu.show();
        subMenuBounds = subMenu[0].getBoundingClientRect();
        body = document.querySelector('body');
        offset = body.clientHeight - (subMenuBounds.height + subMenuBounds.top + 5);
        if (offset < 0) {
            subMenu.css('top', offset + 'px');
        }

    };

    this.hideSubMenu = function($event, item) {
        var menu = $($event.currentTarget),
            subMenu = menu.children("ul.dropdown-menu");
        subMenu.css('top', '0px');
        subMenu.hide();
    };

    $scope.setContentLoading = function(flag) {
        if (flag) {
            $scope.itemsLoading = true;
            $scope.processing = true;
        } else {
            $scope.itemsLoading = false;
            $scope.processing = false;
            $scope.$root.showLoading = false;
        }
    };
});
