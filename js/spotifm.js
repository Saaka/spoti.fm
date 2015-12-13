var app = angular.module('spotifm', ['ngAnimate', 'toaster', 'ngClipboard'])
    .config(['ngClipProvider', function (ngClipProvider) {
        ngClipProvider.setPath("utils/ZeroClipboard.swf");
    }]);

app.controller('MainCtrl', ['$scope', 'toaster', '$http', 'lastfmAPI', function ($scope, toaster, $http, lastfmAPI) {
    $scope.trackList = [];
    $scope.loadingData = true;
    $scope.userName = '';
    $scope.showData = false;

    $scope.doLoad = function () {
        toaster.clear();
        $scope.trackList = [];
        if ($scope.selectedPeriod == null || $scope.selectedPeriod.value == null) {
            toaster.error('Error', 'Select period');
            return;
        }

        $scope.loadingData = true;
        $scope.showData = true;
        lastfmAPI.getUserTopTracksForPeriod($scope.userName, $scope.selectedPeriod.value)
            .then(function (data) {
                $scope.trackList = data;
                $scope.loadingData = false;
            }).catch(function (error) {
                toaster.error('Error', error);
                $scope.showData = false;
                $scope.loadingData = false;
            });
    }

    $scope.getImg = function (addr) {
        if (addr == null || addr == '') {
            return '/img/fall_track.png'
        } else {
            return addr;
        }
    }

}]);
