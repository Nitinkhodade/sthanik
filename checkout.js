var app = angular.module('bringGroceryApp');

app.controller('checkoutCtrl', function($scope, $rootScope, $location, $mdDialog) {
    var me = this;
    $scope.init = function() {
        if (!$rootScope.getCookieData('authToken')) {
            $location.path("/401");
        }
        $('.tab-block .step').tooltip();
        me.bindEvents();
        $scope.rc.updateDeliveryCharges();
        $('.root-wrapper').attr('id', 'checkout-page');
    };
    this.bindEvents = function() {
        $('.step').on('show.bs.tab', function(e) {
            var $target = $(e.target);
            if ($target.parent().hasClass('disabled')) {
                return false;
            }
        });
        $(".next-step").click(function(e) {
            me.activateNext();
        });
        $(".prev-step").click(function(e) {
            var $active = $('.board .nav-tabs .tab-block.active');
            me.prevTab($active);
            $('html,body').animate({
                scrollTop: 0
            }, 'slow');
        });
        $(".makeOrder").click(function() {
            $scope.includeTemplate = true;
            $scope.$broadcast('makeOrder');
        });
        $scope.$on("orderSuccess", function(event, orderData) {
            $scope.$broadcast('orderComplete', orderData);
            me.activateNext();
            $('.finish-tab').siblings().addClass('disabled');
        });
    };
    this.nextTab = function(elem) {
        $(elem).next().find('.step').click();
    };

    this.prevTab = function(elem) {
        $(elem).prev().find('.step').click();
    };

    this.activateNext = function() {
        var $active = $('.board .nav-tabs .tab-block.active');
        $active.next().removeClass('disabled');
        me.nextTab($active);
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    };
});
