'use strict';

angular.module('b4f.dashboard', ['ngRoute', 'ngStorage','chart.js'])

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

.controller('DashboardCtrl', ['$scope', '$http', '$localStorage', '$location', function ($scope, $http, $localStorage, $location) {

    var auth = $localStorage.userInfo != null && $localStorage.userInfo != undefined ? $localStorage.userInfo.token : undefined;

     $scope.fetchReserves = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rental',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.rentals = response.data;
            console.log(response.data);
              $scope.loadTripDurationData();
        }, function errorCallback(response)  {

        })
    }
    $scope.fetchReserves();
    $scope.fetchVenues = function () {
        $scope.bikesPromise = $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/rentplace',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.venues = response.data;
            console.log(response.data);
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
    $scope.labels = ["0","1", "2", "3", "4", "5", "6"];
  $scope.series = ['Trip Duration'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55,100]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
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
  
    $scope.labels2 = ["0","1", "2", "3", "4", "5", "6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
  $scope.series2 = ['Trip Duration'];
  $scope.data2 = [
    [65, 59, 80, 81, 56, 55,100,59, 80, 81, 56, 55,100,59, 80, 81, 56, 55,100,59, 80, 81, 56]
  ];
  $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];
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
  
  $scope.loadTripDurationData = function(){
          var daticos = [0,0,0,0,0,0,0];
        var daticos2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          $scope.rentals.forEach(function(entry) {
              var dateTal = new Date(entry.rentDate);
              var fechaI = Date.parse(entry.rentDate);
              var fechaF = Date.parse(entry.modifiedAt);
              var restaMil = fechaF-fechaI;
              var restaSegs = restaMil/1000;
              var restaMins = restaSegs/60;
              var restaH =restaMins/60;
              var intHor = Math.round(restaH);
              if(intHor<7)
                  {
                      daticos[intHor]=daticos[intHor]+1;
                  }
              daticos2[dateTal.getHours()]=daticos2[dateTal.getHours()]+1;
              $scope.data=daticos;
              $scope.data2=daticos2;
          });
  }

}]);