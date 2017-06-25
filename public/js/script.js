var app = angular.module('myApp', ['ngRoute', 'ngResource']);

app.run(['$http', '$rootScope', '$location', function ($http, $rootScope, $location) {
    $rootScope.isLogin = false;
    $rootScope.current_user = '';

    $rootScope.logOut = function () {
        $http.get('/logout');
        $rootScope.isLogin = false;
        $rootScope.current_user = '';
    };
    $rootScope.click = function (resource) {
        $location.path(resource);

    };
}]);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'main.html'
    })

        .when('/login', {
        templateUrl:'login.html',
        controller: 'loginCntrl'
    })

        .when('/register', {
        templateUrl: 'register.html',
        controller: 'registerCntrl'
    })

        .when('/home', {
        templateUrl: 'home.html',
        controller:'homeCntrl',
        resolve:['session', function (session) {
        return session.resolve();
    }]
              })
        .when('/profile', {
        templateUrl: 'profile.html',
        controller:'profileCntrl',
        resolve:['session', function (session) {
            return session.resolve();
        }]
    })
        .when('/message', {
        templateUrl: 'message.html',
        controller:'messageCntrl',
        resolve:['session', function (session) {
            return session.resolve();
            function()
        }]
        })
                 .otherwise({
                 redirectTo:'/'
                 });

                 });



                 app.factory('session', ['$http','$q','$location',function($http,$q,$location){
                 return{
                 resolve: function(){
                 var def = $q.defer();
                 $http.get()
                 .then(function(success){
                 if(success.data.state=='loggedIn'){
                 def.resolve();
                 }else{
                 $location.path('/');
                 }
                 }, function(error){
                 $location.path('/');
                 });
                 return def.promise;
                 }
                 }
                 }]);

        app.controller('loginCntrl', ['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location){
        $scope.user ={
        userName:'',
        password:''
    };
              $scope.login = function(){ 
        $http.post('/login',$scope.user)
            .then(function success(response){
            if(response.data ==null){
                $scope.error_message = "Invalid Username or Password";
            }else{
                $rootScope.isLogin = true;
                $rootScope.current_user = response.data.user;
                $location.path('/home');
            }
        }, function error(response){
            $scope.error = data.message;
        });
    }
}]);


app.controller('registerCntrl', ['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location){
    $scope.user ={
        Username:'',
        password:'',
        email:'',
        firstName:'',
        lastName:''

    };
    $scope.register = function(){ 
        //console.log($scope.user)
        $http.post('/register',$scope.user)
            .then(function success(response){
            console.log(response);
            if(response.data.state =="success"){
                $rootScope.isLogin = true;
                $rootScope.current_user = response.data.user;
                $location.path('/home');
            }
        }, function error(response){
            console.log(response)
            $scope.error = response.message;
        });
    }
}]);

app.controller('profileCntrl',['$scope','$http','$rootscope',function($scope,$http,$rootscope){
    $scope.profile = function(){
        console.log($rootscope.current_user);
        $http.get('/getprofile', $rootscope.current_user)
            .then(function success(response){
            if(response.data.state =='success') {
                $scope.user = response.data.user;
            }
        }, function error(response){

        });
    }


}]);
app.controller('homeCntrl', function(){

});

app.controller('messageCntrl', function(){

});