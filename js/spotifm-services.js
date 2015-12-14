app.service('lastfmAPI', ['$http', '$q', function ($http, $q) {

        var apiKey = '6a82616e5f43a1ab1cf7cede2b547e8a';
        var address = 'http://ws.audioscrobbler.com/2.0/?';
	
        //Get to user tracks for given period of time
        this.getUserTopTracksForPeriod = function (userName, period) {
                var defer = $q.defer();
                var method = 'user.getTopTracks';
                $http.get(address + 'method=' + method + '&format=json&user=' + userName + '&api_key=' + apiKey + '&period=' + period)
                        .success(function (data) {
                                if (data.error) {
                                        defer.reject(data.message);
                                } else {
                                        var resultList = [];
                                        var trackList = data.toptracks.track;
                                        trackList.map(function (el) {
                                                var result = {};
                                                result.trackName = el.name;
                                                result.artistName = el.artist.name;
                                                result.smallImage = getSmallFallbackImage(el.image[0]['#text']);
                                                result.rank = el['@attr'].rank;
                                                resultList.push(result);
                                        });
                                        defer.resolve(resultList);
                                }
                        }).error(function (data) {
                                defer.reject(data.message);
                        });

                return defer.promise;
        };

    var getSmallFallbackImage = function (addr) {
        if (addr == null || addr == '') {
            return '/img/fall_track.png'
        } else {
            return addr;
        }
    }
}]);

app.service('spotifyAPI', ['$http', '$q', function($http, $q) {
    var clientId = '07c0d03f5ac14e6a92f4ec6c456aee61';
    var address = 'https://api.spotify.com/v1/';    
}]);