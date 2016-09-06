'use strict';

angular.module('b4f.bikes', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/bikes', {
        templateUrl: 'modules/bikes/bikes.html',
        controller: 'BikesCtrl'
    });
    }])

.controller('BikesCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;


    $http({
        method: 'GET',
        url: 'http://bikes4freeg5.herokuapp.com/bikes',
        headers: {
            Authorization: auth
        }
    }).then(function successCallback(response) {
        $scope.bikes = response.data;
        console.log(response.data);
    }, function errorCallback(response)  {

    })

    $http({
        method: 'GET',
        url: 'http://bikes4freeg5.herokuapp.com/bikeTypes',
        headers: {
            Authorization: auth
        }
    }).then(function successCallback(response) {
        $scope.bikeTypes = response.data;
    }, function errorCallback(response)  {

    })


    $scope.addBike = function () {
        $scope.addingBike = true;
        $scope.newBike = {brand:"", damaged:false, available:true}
    };

    $scope.saveType = function () {
        $scope.addingType = true;
        if ($scope.newType != undefined) {
            if ($scope.newType.name != undefined && $scope.newType.name != '' && $scope.newType.capacity != undefined && $scope.newType.capacity != '') {
                if ($scope.customType){
                    $http({
                        method: 'POST',
                        url: 'http://bikes4freeg5.herokuapp.com/bikeTypes',
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
                }else{
                    //Agregar al modelo del new
                    $scope.type = $scope.newType;
                    $scope.newType = undefined;
                    $scope.customType = false;
                }
            } else {
                $scope.addingType = false;
            }
        } else {
            $scope.addingType = false;
        }
    }
    
    $scope.cancel = function(){
        $scope.addingBike = false;
        $scope.newBike = undefined;
    }
    
    $scope.saveBike = function(){
        $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/'+$scope.type.name,
            headers: {
                Authorization: auth
            },
            data: JSON.stringify($scope.newBike)
        }).then(function successCallback(response) {
            $scope.bikeTypes = response.data;
        }, function errorCallback(response)  {

        }).finally(function () {
            $scope.addingBike = false;
            $scope.newBike = undefined;
        });
    }

    }]);