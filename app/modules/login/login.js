'use strict';

angular.module('b4f.login', ['ngRoute', 'ngStorage'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modules/login/login.html',
            controller: 'LoginCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                    if ($localStorage.userInfo != undefined) {
                        $location.path('/dashboard');
                    }
            }]
            }
        });
}])
    .controller('LoginCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {
        $scope.submit = function () {
            $scope.loginPromise = $http({
                method: 'POST',
                url: 'http://bikes4freeg5.herokuapp.com/auth',
                data: JSON.stringify($scope.loginForm)
            }).then(function successCallback(response) {
                $localStorage.userInfo = response.data;
                $location.path("/dashboard");
            }, function errorCallback(response) {
                console.error(response.data);
            });
        }
}]);