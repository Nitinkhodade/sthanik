var app = angular.module('bringGroceryApp');
app.controller('CartCtrl', function($scope, $rootScope, $location, dataFactory, shoppingCart, ngToast) {
    var me = this;
    this.init = function() {
    };

    this.removeFromCart = function(itemId) {
        var success = shoppingCart.remove(itemId);
        if (success) {
            $scope.rc.upadteCartCount();
            $scope.rc.updateDeliveryCharges();
        }
    };

    this.applyCoupon = function() {
        var coupon = $scope.rc.cart.couponCode,
            promise_coupon,
            couponData = {};
        if (!coupon) {
            $scope.rc.cart.invalidCoupon = true;
            $scope.rc.cart.errorMsg = "Please enter valid coupon";
            $('.coupon-input').addClass('has-error');
            return;
        }
        couponData.customerId = $rootScope.getCookieData("custId");
        couponData.coupan = coupon;
        couponData.itemValue = $scope.rc.cart.totalAmount;
        // couponData.shippingCharges = $scope.rc.cart.deliveryCharges;

        promise_coupon = shoppingCart.applyCouponCode(couponData);
        $scope.$parent.cartLoader=true;
        $scope.$parent.checkoutLoader=true;
        promise_coupon.success(function(data) {
            $scope.$parent.cartLoader=false;
            $scope.$parent.checkoutLoader=false;
            if (data.statusCode > 0 && data.data.isValidCoupon) {
                $scope.rc.cart.invalidCoupon = false;
                $scope.rc.cart.isValidCouponApplied = true;
                $scope.rc.cart.discountValue = data.data.discountAmount;
                $('.coupon-input').removeClass('has-error');
                //Update the price on UI
            }
            else{
                //Show msg.
                $scope.rc.cart.invalidCoupon = true;
                $scope.rc.cart.errorMsg = data.data ? data.data.errorMessage : data.statusText;
                $('.coupon-input').addClass('has-error');
            }
        });
    };

    this.removeCoupon = function() {
        $scope.rc.cart.isValidCouponApplied = false;
        $scope.rc.cart.discountValue = 0;
    };

    /*************** Methods on $scope ******************/
    $scope.getCart = function() {
        return shoppingCart.getCart();
    };
    $scope.redirectToShippingDetails = function() {
        if ($scope.rc.isValidSession()) {
            if ($scope.rc.cart.totalAmount > 0) {
                $location.path("/checkout");
            } else {
                ngToast.create({
                    className: 'danger',
                    content: 'No item in cart, Add items to checkout'
                });
            }
            // $('.close').trigger('click');
        } else {
            angular.element('#signInModal').modal('show');
            $scope.rc.autoRedirectToCheckout = true;
        }
    };
    $scope.getStore = function() {
        return shoppingCart.getStore();
    };
});
