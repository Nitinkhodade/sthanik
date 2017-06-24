var app = angular.module('bringGroceryApp');
app.controller('userProfileCtrl', function($scope, $rootScope, $location, dataFactory, ngToast) {
    $('.root-wrapper').attr('id', 'profile-page');
    var promise,
        me = this;
    $scope.userInfo = {};
    $scope.profileInit = function() {
        me.getUserInfo();
    };

    $scope.init = function() {
        $('.stepTab').click(function() {
            $(".stepTab").removeClass("btn-primary").addClass("btn-default");
            $(this).removeClass("btn-default").addClass("btn-primary");
        });
    };

    this.getUserInfo = function() {
        dataFactory.getUserInfo($rootScope.getCookieData("userName"))
            .success(function(data) {
                $scope.userInfo = data;
            })
            .error(function(error) {
                ngToast.create({
                    className: 'danger',
                    content: "Error while fetching details!!!"
                });
            });
    };

    $scope.editInfo = function() {
        $scope.userProfile = JSON.parse(JSON.stringify($scope.userInfo));
        me.showEditProfile(true);
    };

    $scope.cancelUpdate = function(){
        me.showEditProfile(false);
    };

    $scope.updateUserProfile = function(userForm, isValid) {
        var me = this;
        if(!isValid) return false;
        dataFactory.updateUserInfo(userForm)
            .success(function(data) {
                ngToast.create({
                    className: 'success',
                    content: data.result
                });
                me.showEditProfile(false);
                // $location.path("/profile");
            })
            .error(function(error) {
                ngToast.create({
                    className: 'danger',
                    content: data.result
                });
            });
    };

    this.showEditProfile = function(flag){
        if(!flag){
            // if here, flag is flase or no flag, so hide the edit block
            $('.profileEdit-card').slideUp(400);
            $('.profileCard').slideDown(400);
            return;
        }
        // if here, flag is true, so show the edit block
        $('.profileEdit-card').slideDown(400);
        $('.profileCard').slideUp(400);
        return;
    };
});
