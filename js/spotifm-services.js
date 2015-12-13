app.service('lastfmAPI', ['$http', '$q', function ($http, $q) {

        var apiKey = '6a82616e5f43a1ab1cf7cede2b547e8a';
	
        //Get to user tracks for given period of time
        this.getUserTopTracksForPeriod = function (userName, period) {
                var defer = $q.defer();
                $http.get('http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&format=json&user=' + userName + '&api_key=' + apiKey + '&period=' + period)
                        .success(function (data) {
                                if (data.error) {
                                        reject(data.message);
                                } else {
                                        var resultList = [];
                                        var trackList = data.toptracks.track;
                                        trackList.map(function (el) {
                                                var result = {};
                                                result.trackName = el.name;
                                                result.artistName = el.artist.name;
                                                result.smallImage = el.image[0]['#text'];
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
}]);