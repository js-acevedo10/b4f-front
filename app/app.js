'use strict';

// Declare app level module which depends on views, and components
angular.module('b4f', [
    'ngRoute',
    'ngStorage',
    'b4f.login',
    'b4f.dashboard',
    'b4f.register',
    'b4f.bikes',
    'b4f.retorno',
    'b4f.penalty'
])
.controller('NavController', ['$scope', '$localStorage', '$location', function($scope, $localStorage, $location) {
    $scope.openNav = function () {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }

    $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }
}])
.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({
        redirectTo: '/login'
    });
}]);