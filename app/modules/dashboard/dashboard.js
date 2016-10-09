'use strict';

angular.module('b4f.dashboard', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'modules/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
}])

.controller('DashboardCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

        $scope.fetchReserves = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rental',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.rentals = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {

        })
    }
    $scope.fetchReserves();
       $scope.fetchVenues = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.venues = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {

        })
    }
    $scope.fetchVenues();

    $scope.goToBikes = function () {
        $location.path("/bikes");
    }
    $scope.goToPoints = function () {
        $location.path("/rentplace");
    }
}]);