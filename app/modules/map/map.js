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
    $scope.venues =[];
    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
    var role = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('role')]) : undefined;
    var id = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('id')]) : undefined;
   $scope.map = { center: { latitude: 4.71, longitude: -74.07 }, zoom: 8 };

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


    }]);