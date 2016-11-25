'use strict';

angular.module('b4f.penalty', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/penalty', {
        templateUrl: 'modules/penalty/penalty.html',
        controller: 'PenaltyCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
    }])

.controller('PenaltyCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
    var role = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('role')]) : undefined;
    var id = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('id')]) : undefined;
    
    $scope.isSuspended = function (date){
        return moment(date).fromNow();
    };
    
    if (role == "client"){
        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/client/'+id,
//                    url: 'http://localhost:8080/client'+id,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.clients = [response.data];
        }, function errorCallback(response)  {

        })
        $scope.penaltyClass = function (pending) {
            return pending ? 'label-danger' : 'label-success';
        }
        
        $scope.searchClientPenalties = function (userId, mail) {
            $scope.penalties = [];
            $scope.currentUser = mail;
            $http({
                method: 'GET',
                url: 'http://bikes4freeg5.herokuapp.com/penalty/' + userId,
//                        url: 'http://localhost:8080/penalty/'+userId,
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.penalties = response.data;
            }, function errorCallback(response)  {

            });

            
        }
    }else{
        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/client',
//                    url: 'http://localhost:8080/client',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.clients = response.data;
        }, function errorCallback(response)  {

        })
        $scope.penaltyClass = function (pending) {
            return pending ? 'label-danger' : 'label-success';
        }
        $scope.searchClientPenalties = function (userId, mail) {
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

            });

            $scope.currentUser = mail;
        }
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