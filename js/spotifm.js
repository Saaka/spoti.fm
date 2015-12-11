var app = angular.module('spotifm', ['ngAnimate', 'toaster', 'ngClipboard'])
        .config(['ngClipProvider', function(ngClipProvider) {
            ngClipProvider.setPath("utils/ZeroClipboard.swf");
        }]);

app.controller('MainCtrl',['$scope', 'toaster', '$http', function($scope, toaster, $http) {
    
    $scope.name = 'Spoti.fm';
    $scope.trackList = [];
    $scope.loadingData = true;
    $scope.apiKey= '6a82616e5f43a1ab1cf7cede2b547e8a';
    $scope.userName = '';
    $scope.showData = false;
    //$scope.selectedPeriod = null;
    
    $scope.doLoad = function() {
        toaster.clear();
        $scope.trackList = [];
        if($scope.selectedPeriod == null || $scope.selectedPeriod.value == null) {
                    toaster.error('Error', 'Select period');
            return;
        }
        
        $scope.loadingData = true;
        $scope.showData = true;
        $http.get('http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&format=json&user=' + $scope.userName + '&api_key=' + $scope.apiKey + '&period=' + $scope.selectedPeriod.value)
            .success(function(data) {
                if(data.error) {
                    $scope.showData = false;
                    toaster.error('Error', data.message);
                }else {
                    $scope.trackList = data.toptracks.track;
                }
            }).error(function(data) {
                    $scope.showData = false;
                    toaster.error('Error', data.message);
            }).finally(function() {
              $scope.loadingData = false;  
            });
    }
    
    $scope.getImg = function(addr) {
        if(addr == null || addr == '') {
            return '/img/fall_track.png'
        } else {
            return addr;    
        }
    }
    
    $scope.copyTrackInfo = function(track) {
        return track.name;
    }
    
}]);
