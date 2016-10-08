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

.controller('PlaceCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {
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

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;


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