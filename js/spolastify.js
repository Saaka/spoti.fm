var app = angular.module('spolastify', []);

app.controller('MainCtrl',['$scope', '$http', function($scope, $http) {
    $scope.name = 'spolastify';
    $scope.trackList = [];
    $scope.loadingData = true;
    $scope.apiKey= '6a82616e5f43a1ab1cf7cede2b547e8a';
    $http.get('http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&format=json&user=saka2&api_key=6a82616e5f43a1ab1cf7cede2b547e8a&period=12month')
        .success(function(data) {
            $scope.trackList = data.toptracks.track;
    }).finally(function() {
      $scope.loadingData = false;  
    });
}]);