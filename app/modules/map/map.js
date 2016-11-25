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

.controller('MapCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64','uiGmapIsReady', function ($scope, $http, $localStorage, $location, $base64, IsReady) {
    $scope.venues =[];
    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
    var role = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('role')]) : undefined;
    var id = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('id')]) : undefined;
      
   $scope.map = { center: { latitude: 4.71, longitude: -74.07 }, zoom: 10 ,markers: [],};
  IsReady.promise()                     // this gets all (ready) map instances - defaults to 1 for the first map
    .then(function(instances) {                 // instances is an array object
        $scope.datMap = instances[0].map;            // if only 1 map it's found at index 0 of array
        $scope.fetchVenues();       // this function will only be applied on initial map load (once ready)
    });
 $scope.fetchVenues = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.venues = response.data;
            $scope.venues.forEach(function(entry){
                if(entry.coordinates!==undefined) {
                         var marker = {
                                id: entry.id,
                                coords: {
                                    latitude: entry.coordinates.latitude,
                                    longitude: entry.coordinates.longitude
                                },
                                name: entry.name,
                                address: entry.address
                            };
                        $scope.map.markers.push(marker);
                    //    $scope.$apply();
                    }
            });
            
        }, function errorCallback(response)  {

        })
    }
    


    }]);