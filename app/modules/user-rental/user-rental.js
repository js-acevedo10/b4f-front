'use strict';

angular.module('b4f.userRental', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/urental', {
            templateUrl: 'modules/user-rental/user-rental.html',
            controller: 'usrRentalCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', '$base64', function ($localStorage, $location, $base64) {
                    if ($localStorage.userInfo == undefined) {
                        $location.path('/login');
                    } else if ($base64.decode($localStorage.userInfo[$base64.encode('role')]) != "client") {
                        $location.path('/dashboard');
                    }
                }]
            }
        });
    }])
    .controller('usrRentalCtrl', ['$scope', '$http', '$localStorage', '$location', '$route', '$uibModal', '$base64', function ($scope, $http, $localStorage, $location, $route, $uibModal, $base64) {

        var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
        var id = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('id')]) : undefined;
        
        $scope.loading = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rental/'+id,
            headers: {
                Authorization: auth
            }
//            ,data: JSON.stringify($scope.loginForm)
        }).then(function successCallback(response) {
            $scope.rentals = response.data;
        }, function errorCallback(response) {
            console.error(response.data);
            $scope.error = "You have no rentals";
        });
        
        $scope.formatStartDate = function(date){
            return moment(date).startOf('hour').fromNow();
//            return moment(date).calendar();
        }
        
        $scope.formatPastDates = function(date){
            //            return moment(date).startOf('hour').fromNow();
            return moment(date).calendar();
        }
        
        $scope.authorizeUser = function (rental) {

//            var inx = $scope.rentals.indexOf(rental);
//            if (inx>-1){
//                $scope.rentals.splice(inx, 1);
//            }
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'add-user.html',
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage, rental, $base64) {

                    $scope.client = {
                        mail: "",
                    };

                    $scope.rental = rental;
                    
                    $scope.okAdd = function () {

                        var accessToken = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
                        
                        $scope.addingUser = $http({
                            method: 'PUT',
                            url: 'http://bikes4freeg5.herokuapp.com/rental/'+rental.id,
//                            url: 'http://localhost:8080/rental/'+rental.id,
                            data: $scope.client,
                            headers: {
                                "Authorization": accessToken
                            }
                        }).then(function successCallback(response) {
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
                    rental: function(){
                        return rental;
                    }
                }
            });

            modalInstance.result.then(function (rental) {
                
            }, function () {

            });

        };

    }]);