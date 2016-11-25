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
        $scope.fetchPenalties = function(){
            $http({
            method: 'GET',
            url: 'http://bikes4freeg5.herokuapp.com/client',
//                    url: 'http://localhost:8080/client',
            headers: {
                Authorization: auth
            }
        }).then(function successCallback(response) {
            $scope.penalties = response.data;
        }, function errorCallback(response)  {

        })
        }
        $scope.fetchPenalties();
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
            }, function errorCallback(response)  {

            })
        }
        $scope.fetchBikes();
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    
    $scope.generateReport = function(){
        if($scope.venues&&$scope.rentals&&$scope.donaciones&&$scope.bikes&&$scope.penalties)
            {
        var completeObj={
            venues: $scope.venues,
            rentals: $scope.rentals,
            donations: $scope.donaciones,
            bikes: $scope.bikes,
            penalties: $scope.penalties
        }
        var items = completeObj.venues
        var replacer = (key, value) => value === null||value===undefined ? '' : value // specify how you want to handle null values here
        var header = Object.keys(items[0])
        var csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        var csvText ="Venues\r\n"+ csv.join('\r\n')
        csvText += '\r\n\r\n'
        csvText += 'Rentals\r\n'
        var items = completeObj.rentals
        var header = Object.keys(items[0])
        csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csvText += csv.join('\r\n')
        csvText += '\r\n\r\n'
        csvText += 'Donations\r\n'
        var items = completeObj.donations
        var header = Object.keys(items[0])
        csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csvText += csv.join('\r\n')
        csvText += '\r\n\r\n'
        csvText += 'Bikes\r\n'
        var items = completeObj.bikes
        var header = Object.keys(items[0])
        csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csvText += csv.join('\r\n')
        csvText += '\r\n\r\n'
        csvText += 'Penalties\r\n'
        var items = completeObj.penalties
        var header = Object.keys(items[0])
        csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csvText += csv.join('\r\n')
        csvText += '\r\n\r\n'
        downloadCSV(csvText)
            }else{
                alert('Please wait, loading information for your report')
            }
         //Generate a file name
 
    }
    function downloadCSV(csv){
           var fileName = "Bikes4FreeReport";
 
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }
}]);