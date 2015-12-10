var app = angular.module('spotifm', []);

app.controller('MainCtrl',['$scope', '$http', function($scope, $http) {
    
    $scope.name = 'Spoti.fm';
    $scope.trackList = [];
    $scope.loadingData = true;
    $scope.apiKey= '6a82616e5f43a1ab1cf7cede2b547e8a';
    $scope.userName = '';
    $scope.showData = false;
    $scope.errorMsg = '';
    
    $scope.doLoad = function() {
        $scope.loadingData = true;
        $scope.showData = true;
        $scope.showError = false;
        $scope.errorMsg = '';
        $scope.trackList = [];
        
        $http.get('http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&format=json&user=' + $scope.userName + '&api_key=' + $scope.apiKey + '&period=12month')
            .success(function(data) {
                if(data.error) {
                    $scope.showData = false;
                    $scope.showError = true;
                    $scope.errorMsg = data.message;
                }else {
                    $scope.trackList = data.toptracks.track;
                }
            }).error(function(data) {
                var err = data;  
            }).finally(function() {
              $scope.loadingData = false;  
            });
    }
    
}]);

app.directive('periodSelect', function() {

    
});