'use strict';

angular.module('b4f.bikes', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/bikes', {
            templateUrl: 'modules/bikes/bikes.html',
            controller: 'BikesCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                    if ($localStorage.userInfo == undefined) {
                        $location.path('/login');
                    }
            }]
            }
        });
}])
    .controller('BikesCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

        var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

        $scope.editMode = false;
        $scope.fetchBikes = function () {
            $scope.bikesPromise = $http({
                method: 'GET',
                url: 'http://bikes4freeg5.herokuapp.com/bikes',
                //          url: 'http://localhost:8080/bikes',

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

        $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace/',
            //      url: 'http://localhost:8080/rentplace/',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.venues = response.data;
        }, function errorCallback(response)  {
            $scope.error = response.data;
        })

        $scope.fetchBikeTypes = function () {
            $scope.bikesPromise = $http({
                method: 'GET',
                url: 'http://bikes4freeg5.herokuapp.com/bikeTypes',
                //          url: 'http://localhost:8080/bikeTypes',
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.bikeTypes = response.data;
            }, function errorCallback(response)  {

            })

        }
        $scope.fetchBikeTypes();

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
                        $scope.bikesPromise = $http({
                            method: 'POST',
                            url: 'http://bikes4freeg5.herokuapp.com/bikeTypes',
                            //                        url: 'http://localhost:8080/bikeTypes',
                            headers: {
                                Authorization: auth
                            },
                            data: JSON.stringify($scope.newType)
                        }).then(function successCallback(response) {
                            $scope.bikeTypes = response.data;
                            $scope.selectedType = $scope.bikeTypes[$scope.bikeTypes.length - 1];
                            $scope.newType = undefined;
                            $scope.customType = false;
                            $scope.bikesPromise = $http({
                                method: 'POST',
                                url: 'http://bikes4freeg5.herokuapp.com/bikes/' + $scope.selectedType.id + '/' + $scope.selectedVenue.id,
                                //url: 'http://localhost:8080/bikes/' + $scope.selectedType.id + '/' + $scope.selectedVenue.id,
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
            $scope.bikesPromise = $http({
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
        $scope.saveBike = function () {

            if ($scope.customType == "true") {
                $scope.saveType();
            } else {
                //$scope.newBike.history = [$scope.selectedVenue];
                //$scope.newBike.bikeType = $scope.selectedType;
                $scope.bikesPromise = $http({
                    method: 'POST',
                    url: 'http://bikes4freeg5.herokuapp.com/bikes/' + $scope.selectedType.id + '/' + $scope.selectedVenue.id,
                    //url: 'http://localhost:8080/bikes/' + $scope.selectedType.id + '/' + $scope.selectedVenue.id,
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
        }
        $scope.saveEditedBike = function () {
            $scope.bikesPromise = $http({
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
            $scope.bikesPromise = $http({
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