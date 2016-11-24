'use strict';

angular.module('b4f.register', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'modules/register/register.html',
        controller: 'RegisterCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo != undefined) {
                    $location.path('/dashboard');
                }
            }]
        }
    });
}])
.controller('RegisterCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {
    $scope.clientVisible = true;
    $scope.adminVisible = false;
    $scope.managerVisible = false;
    $scope.submit = function () {
        $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/client',
            data: JSON.stringify($scope.register)
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
        });
    }
    $scope.submitA = function () {
        $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/admin',
            data: JSON.stringify($scope.registerA)
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
        });
    }
    $scope.submitM = function () {
        $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/manager',
            data: JSON.stringify($scope.registerM)
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
        });
    }

    $scope.setClientVisible = function () {
        $scope.clientVisible = true;
        $scope.managerVisible = false;
        $scope.adminVisible = false;
    }
    $scope.setAdminVisible = function () {
        $scope.clientVisible = false;
        $scope.managerVisible = false;
        $scope.adminVisible = true;
    }
    $scope.setManagerVisible = function () {
        $scope.clientVisible = false;
        $scope.managerVisible = true;
        $scope.adminVisible = false;
    }
}]);