var app = angular.module('bringGroceryApp');
app.controller('resetPwdCtrl', function ($scope,$location,$http,authService,ngToast) {
	   var promise;
	   var userName;
       var qs = $location.search();
       $scope.token = qs['token'];
       promise = authService.authenticatePwdResetToken($scope.token);
       promise.then(function(data) {
    	  if(data.result=="")
    		  {
    	      ngToast.create({
    	          className: 'danger',
    	          content: 'Password reset request is expired. Please resend request using Password resend link.'
    	        });
    		  
	    		  $location.path("/");
    		  }
    	  else
    		  {
    		  	  userName = data.result;
    		  }
	   });
       $scope.resetPassword = function(newPassword,reEnterPassword)
       {
    	   if(newPassword != reEnterPassword)
    		   {
    		   alert("Password and re-entered password is not same");
    		   return false;
    		   }
    	   var credentials = {
    			    "userName": userName, //set true to see CSS if needed
    			    "newPassword": newPassword,
    			    "token" : $scope.token
    			  }
    	   promise = authService.resetPassword(credentials);
    	   promise.then(function(data){
     	      ngToast.create({
    	          className: 'success',
    	          content: data.statusText
    	        });
    		  $location.path("/");
    	   });
       }
});

app.controller('emailVerifyCtrl', function ($scope,$location,$http,authService,ngToast) {
	
	var serviceCalled = false;
	this.getEmailVerified = function()
	{
	if(serviceCalled == false)
		{
		   serviceCalled = true;
	       var qs = $location.search();
	       $scope.emailToken = qs['token'];
	       var promise = authService.verifyEmail($scope.emailToken);
	       promise.then(function(data) {
	     	      ngToast.create({
	    	          className: 'success',
	    	          content: data.result
	    	        });
	    	   $location.path("/");
	       });
		}
	}
	this.getEmailVerified();
});
