'use strict';

angular.module('b4f.login', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modules/login/login.html',
            controller: 'LoginCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                    if ($localStorage.userInfo != undefined) {
                        $location.path('/dashboard');
                    }
            }]
            }
        });
}])
    .controller('LoginCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {
        $scope.submit = function () {
            $scope.loginPromise = $http({
                method: 'POST',
                url: 'http://bikes4freeg5.herokuapp.com/auth',
                data: JSON.stringify($scope.loginForm)
            }).then(function successCallback(response) {
//                var x = angular.copy(response.data);
//                var y = {};
//                angular.forEach(x, function (value, key) {
//                    value = $base64.encode(value);
//                    y[$base64.encode(key)] = value;
//                })
//                $localStorage.userInfo = y;
                $localStorage.userInfo = response.data;
                $location.path("/dashboard");
            }, function errorCallback(response) {
                console.error(response.data);
                $scope.loginError = "Please check your credentials";
            });
        }
}]);