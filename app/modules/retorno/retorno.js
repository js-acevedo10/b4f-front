'use strict';

angular.module('b4f.retorno', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/rentplace', {
        templateUrl: 'modules/retorno/retorno.html',
        controller: 'PlaceCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
}])

.controller('PlaceCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {
    $scope.editMode = false;
    $scope.editPlace = function (place) {
        console.log(place);
        $scope.venuesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace/' + place.id,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.newPlace = response.data;
            $scope.newPlace.$oid = place.id;
            console.log(response.data);
            $scope.editMode = true;
            return response;

        }, function errorCallback(response)  {
            console.log("error finding one place: ");
            console.log(response);
        })
    }

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;


    $scope.fetchPlaces = function () {
        $scope.venuesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace/',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.places = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {
            console.log("error places: ");
            console.log(response);
        })

    }
    $scope.fetchPlaces();

    $scope.addPlace = function () {
        $scope.addingPlace = true;
        $scope.newPlace = {
            storingCapacity: 100,
            bikes: null
        }
    };

    $scope.cancel = function () {
        $scope.addingPlace = false;
        $scope.newPlace = undefined;
        $scope.editMode = false;
    }

    $scope.savePlace = function () {
        $scope.coordinatesPromise = $http({
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.newPlace.address.replace(" ","+").replace("#","")+",+Bogotá,+Colombia&key=AIzaSyAliwV2fQFHtOTJl9Sd0OB0_bHIKf5zXGg",
            
        }).then(function successCallback(response) {
            console.log(response.data);
            if(response.data.results===undefined||response.data.results.length==0)
                {alert("Place coordinates not found, try other address format")}
            else{
                var loc = response.data.results[0].geometry.location;
            var posObj={
                latitude: loc.lat,
                longitude: loc.lng
            }
            $scope.newPlace.coordinates=posObj;
                    $scope.venuesPromise = $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace',
            headers: {
                Authorization: auth
            },
            data: JSON.stringify($scope.newPlace)
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response)  {

        }).finally(function () {
            $scope.addingPlace = false;
            $scope.newPlace = undefined;
            $scope.editMode = false;
            $scope.fetchPlaces();
        });
            }
            
        }, function errorCallback(response)  {
            console.log("error places: ");
            console.log(response);
        })

    }
    $scope.saveEditedPlace = function () {
        $scope.venuesPromise = $http({
            method: 'PUT',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace/' + $scope.newPlace.id,
            headers: {
                Authorization: auth
            },
            data: JSON.stringify($scope.newPlace)
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response)  {

        }).finally(function () {
            $scope.addingPlace = false;
            $scope.newPlace = undefined;
            $scope.editMode = false;
            $scope.fetchPlaces();
        });
    }
    $scope.deletePlace = function (place) {
        $scope.venuesPromise = $http({
            method: 'DELETE',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace/' + place.id,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            console.log("Delete succeded ");
            $scope.editMode = false;
            $scope.fetchPlaces();
            return response;

        }, function errorCallback(response)  {
            console.log("error deleting one place: ");
            console.log(response);
        })
    };
}]);