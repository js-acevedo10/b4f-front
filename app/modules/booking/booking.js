'use strict';

angular.module('b4f.booking', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/booking', {
        templateUrl: 'modules/booking/booking.html',
        controller: 'BookingCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
    }])

.controller('BookingCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
    var id = $base64.decode($localStorage.userInfo[$base64.encode('id')]);
    
    $scope.editMode = false;
    $scope.fetchBikes = function () {
        $http({
            method: 'GET',
                    url: 'http://bikes4freeg5.herokuapp.com/bikes',
            //url: 'http://localhost:8080/bikes',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.bikes = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {

        })
    }
    $scope.fetchBikes();

    $scope.fetchBikeTypes = function () {
        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/bikeTypes',
//                    url: 'http://localhost:8080/bikeTypes',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.bikeTypes = response.data;
        }, function errorCallback(response)  {

        })

    }
    $scope.fetchBikeTypes();


    $http({
        method: 'GET',
        url: 'http://bikes4freeg5.herokuapp.com/rentplace/',
        //        url: 'http://localhost:8080/rentplace/',
        headers: {
            Authorization: auth
        }
    }).then(function successCallback(response) {
        $scope.venues = response.data;
    }, function errorCallback(response)  {
        $scope.error = response.data;
    })

    
    $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/client/'+ id,
            //        url: 'http://localhost:8080/client',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.client = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {

        })

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
        $scope.editMode = false;
    }
    $scope.editBike = function (bike) {
        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/' + bike.id,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.newBike = response.data;
            console.log($scope.newBike);
            $scope.editMode = true;
            return response;

        }, function errorCallback(response)  {
            console.log("error finding one bike: ");
            console.log(response);
        })
    }
    
    $scope.reserveBike = function (bike) {
        
         $http({
            method: 'PUT',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/reserve',
//            url: 'http://localhost:8080/bikes/reserve',
            headers: {
                Authorization: auth
            },
            data: JSON.stringify({"bikeId": bike.id, "userId": id})
        
        }).then(function successCallback(response) {
            
             $scope.client.reserverdBike = bike;
             
            return response;

        }, function errorCallback(response)  {
            console.log("error finding one bike: ");
            console.log(response);
        })
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
            $scope, editMode = false;
            $scope.fetchBikes();
            $scope.fetchBikeTypes();
        });
    }
    $scope.saveEditedBike = function () {
        $http({
            method: 'PUT',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/' + $scope.newBike.id,
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
            $scope.editMode = false;
            $scope.fetchBikes();
            $scope.fetchBikeTypes();
        });
    }
    $scope.deleteBike = function (bike) {

        $http({
            method: 'DELETE',
            url: 'http://bikes4freeg5.herokuapp.com/bikes/' + bike.id,
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