app.controller("rootContoller", function($scope, $rootScope, shoppingCart, dataFactory, $location) {
    var me = this,
        userDetailsPromise;
    $scope.rc = {};

    //define global constants here
    $scope.rc.CONST = {
        STATUS_CODE_SUCCESS: 1,
        STATUS_CODE_FAILED: 0,
        STATUS_CODE_ERROR: -1,
        STATUS_CODE_REDIRECT: 2,
        GATEWAY_TRANSACTION_CHARGES: 2,
        ADMIN_ROLE: "ROLE_ADMIN_STHANIK",
        SUP_ADMIN_ROLE: "ROLE_STHANIK_SUPER_ADMIN",

        ORDER_STATUS_PLACED : "Placed",
        ORDER_STATUS_PENDING_PAYMENT : "PendingOLPay",
        ORDER_STATUS_FAILED_PAYMENT : "FailedOLPay",
        ORDER_STATUS_ACCEPTED : "Accepted",
        ORDER_STATUS_DELIVERED : "Delivered",
        ORDER_STATUS_REJECTED : "Rejected",
        ORDER_STATUS_CANCELED : "Canceled",

        MAX_ITEM_QTY_LIMIT : 10 
    };
    
    $scope.init = function() {
        $scope.rc.cart = {
            invalidCoupon: false,
            isValidCouponApplied: false,
            errorMsg: '',
            cartCount: 0,
            totalAmount: 0,
            discountValue: 0,
            couponCode: '',
            deliveryCharges: 0,
            transactionCharges: 0,
            itemsQuantity: {}
        };
        $scope.rc.showOfferSticker = false;
        me.isMobile();
        $scope.rc.upadteCartCount();
        $scope.rc.updateDeliveryCharges();
        me.bindEvents();

        if ($rootScope.getCookieData('authToken')) {
            userDetailsPromise = dataFactory.getUserDetails($rootScope.getCookieData('authToken') || '');
            userDetailsPromise.then(function(data) {
                var responseData = data.data;
                //console.log(responseData);
                $scope.rc.signinresponse = responseData ? responseData.data : {};
            }, function(reason) {
                console.dir('Failure: ' + reason);
            });
        }
        $scope.$on("$routeChangeSuccess", function(event, newView, oldView) {
            newViewName = newView.$$route.originalPath.split('/')[1];
            $('.root-wrapper').attr('id', newViewName);
        });
        me.userInitialCheckup();

        // me.setFooterAtBottom();
    };

    $scope.adjustFooter = function() {
        var footer = $('.footer'),
            footHeight = footer.outerHeight();
        footer.css('margin-top', -footHeight);
        $('.root-wrapper').css('padding-bottom', footHeight);
    };

    this.bindEvents = function() {
        window.onresize = function() {
            clearTimeout(me.resizeTimeout);
            me.resizeTimeout = setTimeout(function() {
                me.isMobile();
                $scope.$apply();
            }, 100);
        };

        $(document).mouseup(function(e) {
            var dropdownWrap = $('.nav-icon-btns .top-dropdown-wrapper, .nav-btn-wrapper .nav-btn');

            if (!dropdownWrap.is(e.target) && dropdownWrap.has(e.target).length === 0) {
                $scope.rc.showDropdown(e, false);
            }
        });

        $("body").on("change keyup blur input", ".form-input-group .form-input-field", function(event) {
            if ($.trim($(this).val()) !== "") {
                $(this).closest(".form-input-group").find("label").addClass("filled");
            } else {
                $(this).closest(".form-input-group").find("label").removeClass("filled");
            }
        });
    };
    //TODO: when to call this method ??
    this.setFooterAtBottom = function() {
        var footerHeight = $('.footer')[0].clientHeight;
        $('.root-wrapper').css('margin-bottom', footerHeight);
        $('.root-wrapper .footerPusher').css('height', footerHeight);
    };
    $scope.rc.resetCart = function() {
        $scope.rc.cart.invalidCoupon = false;
        $scope.rc.cart.isValidCouponApplied = false;
        $scope.rc.cart.couponCode = '';
        $scope.rc.cart.discountValue = 0;
        $('.coupon-input').removeClass('has-error');
        $scope.rc.upadteCartCount();
    };
    $scope.rc.upadteCartCount = function() {
        var cart = shoppingCart.getCart();
        $scope.rc.cart.itemsQuantity = [];
        $scope.rc.cart.totalAmount = shoppingCart.totalCount();
        $scope.rc.cart.cartCount = cart.length;
        cart.forEach(function(item, index) {
            $scope.rc.cart.itemsQuantity[item.itemId] = item.quantity;
        });
    };
    $scope.rc.menuClick = function(e) {
        e.preventDefault();
        $('.mobie-hamburger-menu.navicon').toggleClass('navicon--act');
        $('.collapse-menu').toggleClass('collapse-menu--act');
    };
    $scope.rc.isValidSession = function() {
        return !!$rootScope.getCookieData('authToken');
    };

    $scope.rc.displayFavoriteStores = function() {
        $location.path("stores/a/0/all/api?fav=1");
    };

    $scope.rc.displayOrderHistory = function() {
        $location.path("/orderHistory");
    };

    $scope.rc.displayShopInventory = function() {
        $location.path("/shopInventory");
    };

    $scope.rc.displayShopItemExportImport = function() {
        $location.path("/shopItemExpImp");
    };

    $scope.rc.displayVendorOrder = function() {
        $location.path("/vendorOrder");
    };

    $scope.rc.displayProfile = function() {
        $location.path("/profile");
    };

    $scope.rc.displayCreatePayout = function() {
        $location.path("/createPayout");
    };

    $scope.rc.displaySearchPayout = function() {
        $location.path("/searchPayout");
    };

    $scope.rc.displayBuyers = function() {
        $location.path("/buyers");
    };
    
    $scope.rc.manageInventory = function() {
        $location.path("/manageInventory");
    };

    $scope.rc.showDropdown = function($event, flag) {
        var navBtnWrapper;
        $('.active-dropdown').removeClass('active-dropdown');
        if (flag) {
            navBtnWrapper = $($event.currentTarget).closest('.nav-btn-wrapper');
            navBtnWrapper.addClass('active-dropdown');
        }
    };
    $scope.rc.getFullOrderDetails = function() {
        var orderItems = [],
            cartList = shoppingCart.getCart(),
            totalPrice = 0,
            store = $rootScope.getCookieData('storedetail'),
            orderDetails;

        cartList.forEach(function(item, i) {
            totalPrice = totalPrice + item.quantity * item.price;
            orderItems.push({
                itemId: item.itemId,
                productName: item.productName,
                itemQuantity: item.quantity,
                itemTotalPrice: item.quantity * item.price,
                itemPrice: item.price
            });
        });

        orderDetails = {
            "custId": $rootScope.getCookieData("custId"),
            "vendorId": store.storeId,
            "orderTotal": totalPrice,
            "payTotal": totalPrice,
            "orderStatus": "Placed",
            "customerOrderItems": orderItems,
            "vendorName": store.name,
            "vendorMobileNo": store.contactNo,
            "customerRemarks": "",
            "customerType": $rootScope.getCookieData("userType")
        };
        return orderDetails;
    };
    $scope.rc.updateDeliveryCharges = function() {
        var orderTotal = $scope.rc.cart.totalAmount,
            store = $rootScope.getCookieData('storedetail'),
            chargesCondition;

        $scope.rc.cart.deliveryCharges = 0;

        if (!orderTotal || !store) {
            return;
        }

        chargesCondition = store.deliverChargesList;

        chargesCondition.forEach(function(cond) {
            if (cond.lowerLimit <= orderTotal && orderTotal <= cond.upperLimit) {
                $scope.rc.cart.deliveryCharges = cond.charges;
            }
        });

        // var orderDetails = $scope.rc.getFullOrderDetails();
        // promise = shoppingCart.getDeliveryCharges(orderDetails);
        // promise.then(function(data) {
        //     $scope.rc.cart.deliveryCharges = data;
        // });
    };

    $scope.rc.logout = function() {
        $rootScope.deleteCookieData('authToken');
        $location.path('/');
    };

    this.isMobile = function() {
        if (window.innerWidth < 768) {
            $scope.rc.mobile = true;
        } else {
            $scope.rc.mobile = false;
        }
    };

    $scope.onItemSearchClick = function(searchInput) {
        // $rootScope.updateCookieData('searchInput', $scope.searchInput);
        // $rootScope.searchInput = searchInput;
        // $scope.rc.searchInput="";
        //alert(inputValue+ "hh"+searchInput);
        $location.path("shop/" + searchInput);

    };
    $scope.redirectForLoaction = function() {
        if ($scope.rc.hasAreaSelection()) {
            return;
        }
        $location.path("/");
    };

    $scope.rc.hasAreaSelection = function() {
        var areaDetails = $rootScope.getCookieData('areadetail');
        if (!areaDetails) {
            return false;
        }
        return true;
    };

    this.userInitialCheckup = function() {
        var $s = $scope,
            me = this,
            offerPromise;
        if ($s.rc.mobile) {
            return;
        }
        offerPromise = dataFactory.getOfferDetails();
        offerPromise.success(function(data) {
            // popup the offer model after 30sec of stay in website
            if (!data.data) {
                return;
            }
            setTimeout(me.showOffersModal, 30000);
            $s.rc.offer = data.data;
        });
    };

    this.showOffersModal = function() {
        $('#offerModal').modal('show');
        $scope.rc.showOfferSticker = true;
    };

    $scope.rc.isUser = function() {
        if ((angular.isDefined($scope.rc.signinresponse)) && ($scope.rc.signinresponse.userType === 'C'))
            return true;
        else
            return false;
    };

    $scope.rc.isVendor = function() {
        if ((angular.isDefined($scope.rc.signinresponse)) && ($scope.rc.signinresponse.userType === 'V'))
            return true;
        else
            return false;
    };

    $scope.rc.isDistributor = function() {
        if ((angular.isDefined($scope.rc.signinresponse)) && ($scope.rc.signinresponse.userType === 'V') && ($scope.rc.signinresponse.businessType === 'B2B') && ($scope.rc.signinresponse.distributor === 'Y'))
            return true;
        else
            return false;
    };

    $scope.rc.isAdmin = function() {
        if ((angular.isDefined($scope.rc.signinresponse)) && (angular.isDefined($scope.rc.signinresponse.roles)) && ($scope.rc.signinresponse.roles.indexOf($scope.rc.CONST.ADMIN_ROLE) > -1))
            return true;
        else
            return false;
    };

    $scope.rc.isSuperAdmin = function() {
        if ((angular.isDefined($scope.rc.signinresponse)) && (angular.isDefined($scope.rc.signinresponse.roles)) && ($scope.rc.signinresponse.roles.indexOf($scope.rc.CONST.SUP_ADMIN_ROLE) > -1))
            return true;
        else
            return false;
    };

    $scope.rc.getUserId = function() {
        if (angular.isDefined($scope.rc.signinresponse))
            return $scope.rc.signinresponse.custId;
        else
            return 0;
    };

    $scope.rc.canCancel = function(orderStatus) {
            if (orderStatus === $scope.rc.CONST.ORDER_STATUS_PLACED || orderStatus === $scope.rc.CONST.ORDER_STATUS_ACCEPTED)
                return true;
            else
                return false;
        };
});
