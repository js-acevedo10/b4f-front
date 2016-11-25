'use strict';

angular.module('b4f.rental', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/rental', {
            templateUrl: 'modules/rental/rental.html',
            controller: 'RentalCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', '$base64', function ($localStorage, $location, $base64) {
                    if ($localStorage.userInfo == undefined) {
                        $location.path('/login');
                    }
                    if ($base64.decode($localStorage.userInfo[$base64.encode('role')]) != "manager") {
                        $location.path('/login');
                    }
                }]
            }
        });
    }])
    .controller('RentalCtrl', ['$scope', '$http', '$localStorage', '$location', '$route', '$uibModal', '$base64', function ($scope, $http, $localStorage, $location, $route, $uibModal, $base64) {
        var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;

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
        });

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

        $scope.search = {
            mail: ""
        };

        $scope.searchClient = function () {

            $scope.userSearched = true;

            $scope.loading = $http({
                method: 'PUT',
                url: 'http://bikes4freeg5.herokuapp.com/client/m',
                //                url: 'http://localhost:8080/client/m',
                headers: {
                    Authorization: auth
                },
                data: JSON.stringify($scope.search)
            }).then(function successCallback(response) {
                $scope.reservedBike = response.data.reserverdBike;
            }, function errorCallback(response)  {
                $scope.error = response.data;
            });
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
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, bikeS, venueS, $base64) {

                    $scope.bike = bikeS;
                    $scope.venueName = venueS;

                    $scope.rentInfo = {
                        userMail: "",
                        venueName: $scope.venueName,
                        bikeId: $scope.bike.id
                    };

                    $scope.okRent = function () {

                        var accessToken = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;


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
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, venues, $base64) {


                    var accessToken = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;

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
                    }).finally(function () {});

                    $scope.returnInfo = {

                        mantenimiento: false
                    };

                    $scope.loading = $http({
                        method: 'GET',
                        url: 'http://bikes4freeg5.herokuapp.com/reparacion/',
                        headers: {
                            Authorization: auth
                        }
                    }).then(function successCallback(response) {
                        $scope.reparaciones = response.data;
                        console.log(response.data);
                    }, function errorCallback(response)  {
                        $scope.error = response.data;
                    });

                    $scope.selection = [];

                    $scope.toggleSelection = function toggleSelection(fixId) {
                        var idx = $scope.selection.indexOf(fixId);

                        // is currently selected
                        if (idx > -1) {
                            $scope.selection.splice(idx, 1);
                        }

                        // is newly selected
                        else {
                            $scope.selection.push(fixId);
                        }

                        $scope.returnInfo.selected = $scope.selection;
                        console.log($scope.returnInfo);
                    };


                    $scope.okReturn = function () {



                        $scope.returningBike = $http({
                            method: 'POST',
                            url: 'http://bikes4freeg5.herokuapp.com/rental',
                            //                            url: 'http://localhost:8080/rental',
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
                                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, certificate, $base64) {

                                    $scope.certificate = JSON.parse(certificate);
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