'use strict';

angular.module('b4f.map', ['ngRoute', 'ngStorage','uiGmapgoogle-maps'])

.config(['$routeProvider','uiGmapGoogleMapApiProvider', function ($routeProvider,GoogleMapApiProviders) {
    $routeProvider.when('/map', {
        templateUrl: 'modules/map/map.html',
        controller: 'MapCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
    GoogleMapApiProviders.configure({
            china: true
        });
    }])

.controller('MapCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
    var role = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('role')]) : undefined;
    var id = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('id')]) : undefined;
   $scope.map = {
                events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            $log.info('this is the map instance', map);
                        });
                    }
                }
            }




    }]);