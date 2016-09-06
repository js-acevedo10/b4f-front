'use strict';

angular.module('b4f.penalty', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/penalty', {
        templateUrl: 'modules/penalty/penalty.html',
        controller: 'PenaltyCtrl'
    });
    }])

.controller('PenaltyCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

    $http({
        method: 'GET',
        url: 'http://bikes4freeg5.herokuapp.com/client',
        //        url: 'http://localhost:8080/client',
        headers: {
            Authorization: auth
        }
    }).then(function successCallback(response) {
        $scope.clients = response.data;
        console.log(response.data);
    }, function errorCallback(response)  {

    })
    $scope.penaltyClass = function (pending) {
        return pending ? 'label-danger' : 'label-success';
    }
    $scope.searchClientPenalties = function (userId) {
        $scope.penalties = [];
        
        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/penalty/' + userId,
            //        url: 'http://localhost:8080/penalty/'+userId,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.penalties = response.data;
        }, function errorCallback(response)  {

        })
        
        $scope.currentUser = userId;
    }


    $scope.addBike = function () {
        $scope.addingBike = true;
        $scope.newBike = {
            brand: "",
            damaged: false,
            available: true
        }
    };

    $scope.saveType = function () {
        $scope.addingType = true;
        if ($scope.newType != undefined) {
            if ($scope.newType.name != undefined && $scope.newType.name != '' && $scope.newType.capacity != undefined && $scope.newType.capacity != '') {
                if ($scope.customType) {
                    $http({
                        method: 'POST',
                        url: 'http://bikes4freeg5.herokuapp.com/bikeTypes',
                        //                        url: 'http://localhost:8080/bikeTypes',
                        headers: {
                            Authorization: auth
                        },
                        data: JSON.stringify($scope.newType)
                    }).then(function successCallback(response) {
                        $scope.bikeTypes = response.data;
                        $scope.type = $scope.bikeTypes[$scope.bikeTypes.length - 1];
                        $scope.newType = undefined;
                        $scope.customType = false;
                    }, function errorCallback(response)  {

                    }).finally(function () {
                        $scope.addingType = false;
                    });
                }
            } else {
                $scope.addingType = false;
            }
        } else {
            $scope.addingType = false;
        }
    }

    $scope.cancel = function () {
        $scope.addingBike = false;
        $scope.newBike = undefined;
    }

    $scope.saveBike = function () {
        $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/' + $scope.type.id,
            //            url: 'http://localhost:8080/bikes/'+$scope.type.Id,
            headers: {
                Authorization: auth
            },
            data: JSON.stringify($scope.newBike)
        }).then(function successCallback(response) {
            $scope.bikes = response.data;
        }, function errorCallback(response)  {

        }).finally(function () {
            $scope.addingBike = false;
            $scope.newBike = undefined;
        });
    }

    }]);