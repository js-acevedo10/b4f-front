'use strict';

angular.module('b4f.dashboard', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'modules/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

    $scope.getBike = function (idBike) {
        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/' + idBike,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response)  {

        })
    }

    $scope.goToBikes = function () {
        $location.path("/bikes");
    }
    $scope.goToPoints = function () {
        $location.path("/rentplace");
    }
    $scope.openNav = function () {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }

    $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    $scope.logOut = function () {
        $location.path("/login");
        $localStorage.userInfo = undefined;
    }

}]);