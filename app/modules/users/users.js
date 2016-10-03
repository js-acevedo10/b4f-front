'use strict';

angular.module('b4f.users', ['ngRoute', 'ngStorage'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin/users', {
            templateUrl: 'modules/users/users.html',
            controller: 'UsersCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                    if ($localStorage.userInfo == undefined) {
                        $location.path('/login');
                    }
                    if ($localStorage.userInfo.role != "admin") {
                        $location.path('/login');
                    }
                }]
            }
        });
    }])
    .controller('UsersCtrl', ['$scope', '$http', '$localStorage', '$location', '$route', '$uibModal', function ($scope, $http, $localStorage, $location, $route, $uibModal) {
        var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

        $scope.loading = $http({
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
        
        $scope.loading = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/manager',
            //        url: 'http://localhost:8080/client',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.managers = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {

        })
        
        $scope.loading = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/admin',
            //        url: 'http://localhost:8080/client',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.admins = response.data;
            console.log(response.data);
        }, function errorCallback(response)  {

        })
        
        $scope.removeClient = function(id){
            $scope.loading = $http({
                method: 'DELETE',
                url: 'http://bikes4freeg5.herokuapp.com/client/'+id,
//                url: 'http://localhost:8080/client/'+id,
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.succes = response.data;
                $route.reload();
            }, function errorCallback(response)  {
                $scope.error = response.data;
            }).finally(function () {                
            });
        };
        
        $scope.removeManager = function(id){
            $scope.loading = $http({
                method: 'DELETE',
                url: 'http://bikes4freeg5.herokuapp.com/manager/'+id,
                //        url: 'http://localhost:8080/client',
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.succes = response.data;
                $route.reload();
            }, function errorCallback(response)  {
                $scope.error = response.data;
            }).finally(function () {
            });
        };
        
        $scope.addClient = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'add-client.html',
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage) {

                    $scope.okAdd = function () {
                        var reason = document.getElementById("comment").value;
                        if (reason != undefined && reason != null && reason != "") {
                            $scope.mustProvideReason = false;
                            var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
                            $http({
                                method: 'PUT',
                                url: 'https://captainops-back.herokuapp.com/reservas/' + $scope.reserva._id.$oid + '/status/2',
                                headers: {
                                    "Authorization": accessToken
                                }
                            }).then(function successCallback(response) {
                                $scope.msj = response.data;
                                $uibModalInstance.dismiss(reserva);
                            }, function errorCallback(response) {

                                $scope.error = response.data;

                            }).finally(function () {
                                $route.reload();
                            });
                        } else {
                            $scope.mustProvideReason = true;
                        }
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    reserva: function () {
                        return $scope.reserva;
                    }
                }
            });

            modalInstance.result.then(function (reserva) {

            }, function () {

            });

        };
    }]);