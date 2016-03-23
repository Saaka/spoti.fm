var app = angular.module('spotifm', ['ngAnimate', 'toaster', 'ngClipboard'])
    .config(['ngClipProvider', function (ngClipProvider) {
        ngClipProvider.setPath("utils/ZeroClipboard.swf");
    }]);

app.controller('MainCtrl', ['$scope', 'toaster', '$http', 'lastfmAPI', 'mongger', 'nekudoGeoIp', function ($scope, toaster, $http, lastfmAPI, mongger, nekudoGeoIp) {
    $scope.topTrackList = [];
    $scope.loadingData = true;
    $scope.userName = '';
    $scope.showData = false;
    $scope.geoData = undefined;

    $scope.doLoad = function () {
        toaster.clear();
        $scope.topTrackList = [];
        if ($scope.selectedPeriod == null || $scope.selectedPeriod.value == null) {
            toaster.error('Error', 'Select period');
            return;
        }

        $scope.loadingData = true;
        $scope.showData = true;
        mongger.saveRequestToMongger($scope.userName, $scope.selectedPeriod.value, $scope.geoData);
        lastfmAPI.getUserTopTracksForPeriod($scope.userName, $scope.selectedPeriod.value)
            .then(function (data) {
                $scope.topTrackList = data;
                $scope.loadingData = false;
            }).catch(function (error) {
                $scope.topTrackList = [];
                toaster.error('Error', error);
                $scope.showData = false;
                $scope.loadingData = false;
            });
    }

    var loadGeoData = function () {
        nekudoGeoIp.getGeoInfo()
            .then(function (data) {
                $scope.geoData = data;
            })
            .catch(function (error) {
                console.log(err);
            });
    };

    loadGeoData();
}]);