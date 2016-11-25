'use strict';

angular.module('b4f.dashboard', ['ngRoute', 'ngStorage', 'chart.js'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'modules/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo == undefined) {
                    $location.path('/login');
                }
            }]
        }
    });
}])

.controller('DashboardCtrl', ['$scope', '$http', '$localStorage', '$location', '$base64', function ($scope, $http, $localStorage, $location, $base64) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('token')]) : undefined;
    var id = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('id')]) : undefined;
    $scope.role = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $base64.decode($localStorage.userInfo[$base64.encode('role')]) : undefined;
    $scope.donacionMode = false;

    $scope.fetchReserves = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rental',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.rentals = response.data;
            $scope.loadTripDurationData();
        }, function errorCallback(response)  {

        })
    }
    $scope.fetchReserves();
    
    $scope.fetchDonaciones = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/donations',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.donaciones = response.data;
        }, function errorCallback(response)  {

        })
    };
    $scope.fetchDonaciones();
    $scope.fetchVenues = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.venues = response.data;
        }, function errorCallback(response)  {

        })
    }
    $scope.fetchVenues();

    $scope.goToBikes = function () {
        $location.path("/bikes");
    }
    $scope.goToPoints = function () {
        $location.path("/rentplace");
    }
    $scope.labels = ["0", "1", "2", "3", "4", "5", "6"];
    $scope.series = ['Trip Duration'];
    $scope.data = [
    [0, 0, 0, 0, 0, 0, 0]
  ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
        }
      ]
        }
    }

    $scope.labels2 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    $scope.series2 = ['Trip Duration'];
    $scope.data2 = [
    [65, 59, 80, 81, 56, 55, 100, 59, 80, 81, 56, 55, 100, 59, 80, 81, 56, 55, 100, 59, 80, 81, 56]
  ];
    $scope.datasetOverride2 = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options2 = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
        }
      ]
        }
    }

    $scope.showDonacionMode = function () {
        $scope.donacionMode = !$scope.donacionMode;
    }

    $scope.donate = function () {
        console.log($scope.donacion.monto);
        $scope.fetchReserves = $http({
            method: 'POST',
            url: 'http://bikes4freeg5.herokuapp.com/donations/',
//            url: 'http://localhost:8080/donations',
            headers: {
                Authorization: auth
            },
            data: {
                fecha: new Date().getTime(),
                amount: $scope.donacion.monto,
                userId: id
            }
        }).then(function successCallback(response) {
            $scope.donacionMode = false;
            $('.alertaDonacion').html("<strong>Thank you for donating.</strong>");
            $scope.donaciones = response.data;
        }, function errorCallback(response)  {
            console.error(response);
        })
    }

    $scope.loadTripDurationData = function () {
        var daticos = [0, 0, 0, 0, 0, 0, 0];
        var daticos2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $scope.rentals.forEach(function (entry) {
            var dateTal = new Date(entry.rentDate);
            var fechaI = Date.parse(entry.rentDate);
            var fechaF = Date.parse(entry.modifiedAt);
            var restaMil = fechaF - fechaI;
            var restaSegs = restaMil / 1000;
            var restaMins = restaSegs / 60;
            var restaH = restaMins / 60;
            var intHor = Math.round(restaH);
            if (intHor < 7) {
                daticos[intHor] = daticos[intHor] + 1;
            }
            daticos2[dateTal.getHours()] = daticos2[dateTal.getHours()] + 1;
            $scope.data = daticos;
            $scope.data2 = daticos2;
        });
    }

}]);