'use strict';

angular.module('b4f.rental', ['ngRoute', 'ngStorage'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/rental', {
            templateUrl: 'modules/rental/rental.html',
            controller: 'RentalCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                    if ($localStorage.userInfo == undefined) {
                        $location.path('/login');
                    }
                    if ($localStorage.userInfo.role != "manager") {
                        $location.path('/login');
                    }
                }]
            }
        });
    }])
    .controller('RentalCtrl', ['$scope', '$http', '$localStorage', '$location', '$route', '$uibModal', function ($scope, $http, $localStorage, $location, $route, $uibModal) {
        var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

        $scope.loading = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace/',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.venues = response.data;
        }, function errorCallback(response)  {
            $scope.error = response.data;
        })

        $scope.searchVenueBikes = function (venueId) {
            $scope.bikes = [];

            $http({
                method: 'GET',
                url: 'http://bikes4freeg5.herokuapp.com/rentplace/' + venueId,
                //        url: 'http://localhost:8080/penalty/'+userId,
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.currentVenue = response.data.name;
                $scope.bikes = response.data.bikes;
            }, function errorCallback(response)  {
                $scope.error = response.data;
            })

            
        }


        $scope.isAvilable = function (reserve) {
            if (!reserve) {
                return "Available";
            }
            return "Reserved";
        }

        $scope.rentBike = function (bike) {
            $scope.selectedBike = bike;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'rent-bike.html',
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, bikeS, venueS) {

                    $scope.bike = bikeS;
                    $scope.venueName = venueS;
                    
                    $scope.rentInfo = {userMail:"",
                                    venueName:$scope.venueName,
                                    bikeId:$scope.bike.id};

                    $scope.okRent = function () {

                        var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
                        
                        
                        $scope.rentingBike = $http({
                            method: 'POST',
                            url: 'http://bikes4freeg5.herokuapp.com/rentplace/r',
//                            url: 'http://localhost:8080/rentplace/r',
                            data: JSON.stringify($scope.rentInfo),
                            headers: {
                                "Authorization": accessToken
                            }
                        }).then(function successCallback(response) {
                            $scope.succes = response.data;
                            $uibModalInstance.dismiss();
                        }, function errorCallback(response) {
                            $scope.error = response.data;
                        }).finally(function () {
                            $route.reload();
                        });

                    };

                    $scope.dismiss = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    bikeS: function () {
                        return $scope.selectedBike;
                    },
                    venueS: function () {
                        return $scope.currentVenue;
                    }
                }
            });

            modalInstance.result.then(function (bike) {

            }, function () {

            });

        };

        $scope.returnBike = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'return-bike.html',
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, venues) {
                    
                
                    var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
                    
                    $scope.venues = venues;
                    $scope.returningBike = $http({
                        method: 'GET',
                        url: 'http://bikes4freeg5.herokuapp.com/rental',
                        headers: {
                            "Authorization": accessToken
                        }
                    }).then(function successCallback(response) {
                        $scope.rentals = response.data;
                    }, function errorCallback(response) {
                        $scope.error = response.data;
                    }).finally(function () {
                    });
                    
                    $scope.returnInfo = {rental:"",
                                         returnPoint:"",
                                         mail:"",
                                         pedals:false,
                                         saddle:false,
                                         handlebars:false,
                                         brakes:false,
                                         shifter:false,
                                         holder:false,
                                         frontGrid:false,
                                         backGrid:false,
                                         reflective:false,
                                         plate:false,
                                         bikeBacking:false,
                                         frontFender:false,
                                         backFender:false,
                                         frame:false,
                                         octopus:false,
                                         handle:false
                                        };
                    
                    $scope.okReturn = function () {

                        $scope.returningBike = $http({
                            method: 'POST',
//                            url: 'http://bikes4freeg5.herokuapp.com/rental',
                            url: 'http://localhost:8080/rental',
                            data: JSON.stringify($scope.returnInfo),
                            headers: {
                                "Authorization": accessToken
                            }
                        }).then(function successCallback(response) {
                            $scope.certificate = response.data;
                            $uibModalInstance.dismiss();
                            var modalInstance2 = $uibModal.open({
                                animation: true,
                                templateUrl: 'recipt.html',
                                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, certificate) {

                                    $scope.certificate = certificate;
                                    $scope.dismiss = function () {
                                        $uibModalInstance.dismiss('cancel');
                                    };
                                },
                                size: 'lg',
                                resolve: {
                                    certificate: function () {
                                        return $scope.certificate;
                                    }
                                }

                            });
                        }, function errorCallback(response) {
                            $scope.error = response.data;
                        }).finally(function () {
                            $route.reload();
                        });

                    };

                    $scope.dismiss = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    venues: function () {
                        return $scope.venues;
                    },
                    venueS: function () {
                        return $scope.currentVenue;
                    }
                }
                
            });

            modalInstance.result.then(function (reserva) {

            }, function () {

            });

        };
    }]);