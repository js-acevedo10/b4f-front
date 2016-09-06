'use strict';

angular.module('b4f.retorno', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/rentplace', {
        templateUrl: 'modules/retorno/retorno.html',
        controller: 'PlaceCtrl'
    });
    }])

.controller('PlaceCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;


    $http({
        method: 'GET',
        url: 'http://bikes4freeg5.herokuapp.com/rentplace',
        headers: {
            Authorization: auth
        }
    }).then(function successCallback(response) {
        $scope.places = response.data;
        console.log(response.data);
    }, function errorCallback(response)  {

    })


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
    }

    $scope.savePlace = function () {
        $http({
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
        });
    }

    }]);