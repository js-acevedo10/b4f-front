'use strict';

// Declare app level module which depends on views, and components
angular.module('b4f', [
    'ngRoute',
    'ngStorage',
    'b4f.login',
    'b4f.dashboard',
    'b4f.register',
    'b4f.bikes',
    'b4f.retorno'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({
        redirectTo: '/login'
    });



}]);