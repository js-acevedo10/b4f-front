'use strict';

angular.module('b4f.guide', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/guide', {
        templateUrl: 'modules/guide/guide.html',
        controller: 'GuideCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {

            }]
        }
    });
    }])

.controller('GuideCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {


    }]);