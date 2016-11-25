'use strict';

angular.module('b4f.fixes', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/fixes', {
        templateUrl: 'modules/fixes/fixes.html',
        controller: 'FixesCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
    }])

.controller('FixesCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {
    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;


    $scope.fetchFixes = function () {
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
    }

    $scope.fetchFixes();

    $scope.newFix = {
        fixName: "",
        fee: 0
    }

    $scope.saveFix = function () {
        $scope.fixPromise = $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/reparacion/',
            //url: 'http://localhost:8080/bikes/' + $scope.selectedType.id + '/' + $scope.selectedVenue.id,
            headers: {
                Authorization: auth
            },
            data: JSON.stringify($scope.newFix)
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response)  {

        }).finally(function () {
            $scope.addingBike = false;
            $scope.newFix = undefined;
            $scope.editMode = false;
            $scope.fetchFixes();
        });
    };

    $scope.editFix = function (fix) {
        $scope.fixPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/reparacion/' + fix.id,
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.newFix = response.data;
            console.log($scope.newFix);
            $scope.editMode = true;
            return response;
        }, function errorCallback(response)  {
            console.log("error finding one fix: ");
            console.log(response);
        })
    }

    $scope.saveEditedFix = function () {
        $scope.fixPromise = $http({
            method: 'PUT',
            url: 'http://bikes4freeg5.herokuapp.com/reparacion/' + $scope.newFix.id,
            //            url: 'http://localhost:8080/bikes/'+$scope.type.Id,
            headers: {
                Authorization: auth
            },
            data: JSON.stringify($scope.newFix)
        }).then(function successCallback(response) {
            $scope.reparaciones = response.data;
        }, function errorCallback(response)  {

        }).finally(function () {
            $scope.fetchFixes();
            $scope.newFix = undefined;
            $scope.editMode = false;
        });
    }

    $scope.cancel = function () {
        $scope.newFix = undefined;
        $scope.editMode = false;
    }


            }]);