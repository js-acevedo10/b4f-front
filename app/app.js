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
    .controller('NavController', ['$scope', '$localStorage', '$location', function ($scope, $localStorage, $location) {
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
            if($localStorage.userInfo != null && $localStorage.userInfo != undefined) {
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