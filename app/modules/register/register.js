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
.controller('RegisterCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {
    $scope.clientVisible = true;
    $scope.adminVisible = false;
    $scope.managerVisible = false;
    $scope.submit = function () {
        $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/client',
            data: JSON.stringify($scope.register)
        }).then(function successCallback(response) {
            $localStorage.userInfo = response.data;
            console.log(response.data);
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
            $localStorage.userInfo = response.data;
            console.log(response.data);
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
            $localStorage.userInfo = response.data;
            console.log(response.data);
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