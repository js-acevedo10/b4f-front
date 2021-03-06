'use strict';

// Declare app level module which depends on views, and components
angular.module('b4f', [
    'ngRoute',
    'ngStorage',
    'cgBusy',
    'ngMessages',
    'ui.bootstrap',
    'angular.filter',
    'chart.js',
    'base64',
    'b4f.login',
    'b4f.dashboard',
    'b4f.register',
    'b4f.bikes',
    'b4f.retorno',
    'b4f.penalty',
    'b4f.users',
    'b4f.booking',
    'b4f.rental',
    'b4f.userRental',
    'b4f.map',
    'b4f.guide',
    'b4f.fixes'
])
    .controller('NavController', ['$scope', '$localStorage', '$location', '$base64', function ($scope, $localStorage, $location, $base64) {
        $scope.isLoginNav = function () {
            if ($location.path() == "/login" || $location.path() == "/register") {
                return 'greenNav';
            } else {
                return 'whiteNav';
            }
        }
        $scope.isLoginFont = function () {
            if ($location.path() == "/login" || $location.path() == "/register") {
                return 'greenFont';
            } else {
                return 'whiteFont';
            }
        }
        $scope.isLogged = function () {
            if ($localStorage.userInfo != null && $localStorage.userInfo != undefined) {
                return true;
            }
            return false;
        }

        $scope.isAdmin = function () {
            if ($scope.isLogged() && $base64.decode($localStorage.userInfo[$base64.encode('role')]) == "admin") {
                return true;
            }
            return false;
        }

        $scope.isUser = function () {
            if ($scope.isLogged() && $base64.decode($localStorage.userInfo[$base64.encode('role')]) == "client") {
                return true;
            }
            return false;
        }

        $scope.isManager = function () {
            if ($scope.isLogged() && $base64.decode($localStorage.userInfo[$base64.encode('role')]) == "manager") {
                return true;
            }
            return false;
        }

        $scope.openNav = function () {
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
            document.getElementById("hm").style.visibility = "hidden";
        }
        $scope.closeNav = function () {
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
            document.getElementById("hm").style.visibility = "visible";
        }
        $scope.logOut = function () {
            $scope.closeNav();
            $localStorage.userInfo = undefined;
            $location.path("/login");
        }
}])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/login'
        });
}]);