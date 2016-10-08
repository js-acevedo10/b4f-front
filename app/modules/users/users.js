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

        $scope.isSuspended = function (suspended) {
            if (!suspended) {
                return "Active";
            }
            return "Suspended";
        }

        $scope.removeClient = function (client) {
            $scope.loading = $http({
                method: 'DELETE',
                url: 'http://bikes4freeg5.herokuapp.com/client/' + client.id,
                //                url: 'http://localhost:8080/client/'+ client.id,
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.succes = JSON.parse(response.data);
                var index = $scope.clients.indexOf(client);
                if (index > -1) {
                    $scope.clients.splice(index, 1);
                }
            }, function errorCallback(response)  {
                $scope.error = response.data;
            }).finally(function () {});
        };

        $scope.removeManager = function (manager) {
            $scope.loading = $http({
                method: 'DELETE',
                url: 'http://bikes4freeg5.herokuapp.com/manager/' + manager.id,
                //        url: 'http://localhost:8080/client',
                headers: {
                    Authorization: auth
                }
            }).then(function successCallback(response) {
                $scope.succes = response.data;
                $route.reload();
            }, function errorCallback(response)  {
                $scope.error = response.data;
            }).finally(function () {});
        };

        $scope.addClient = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'add-client.html',
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage) {

                    $scope.client = {
                        name: "",
                        email: "",
                        password: "",
                        suspended: false
                    };

                    $scope.okAdd = function () {
                        
                        var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
                        $scope.addingClient = $http({
                            method: 'POST',
                            url: 'http://bikes4freeg5.herokuapp.com/client',
                            data: $scope.client,
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
                }
            });

            modalInstance.result.then(function (reserva) {

            }, function () {

            });

        };
        
        $scope.addManager = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'add-manager.html',
                controller: function ($scope, $location, $uibModalInstance, $http, $filter, $localStorage) {

                    $scope.manager = {
                        name: "",
                        email: "",
                        password: "",
                        suspended: false
                    };

                    $scope.okAdd = function () {

                        var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
                        $scope.addingManager = $http({
                            method: 'POST',
                            url: 'http://bikes4freeg5.herokuapp.com/manager',
                            data: $scope.manager,
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
                }
            });

            modalInstance.result.then(function (reserva) {

            }, function () {

            });

        };
    }]);