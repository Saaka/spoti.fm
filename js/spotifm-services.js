app.service('lastfmAPI', ['$http', '$q', 'spotifyAPI', function ($http, $q, spotifyAPI) {

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
                        result.trackTitle = el.name;
                        result.artistName = el.artist.name;
                        result.smallImage = getSmallFallbackImage(el.image[0]['#text']);
                        result.rank = el['@attr'].rank;
                        spotifyAPI.getTrackSpotifyData(result.artistName, result.trackTitle)
                            .then(function (data) {
                                result.spotifyUri = data.spotifyUri;
                                result.spotifyPreview = data.spotifyPreview;
                                result.isAvaliable = data.isAvaliable;
                            })
                            .catch(function (error) {
                                result.isAvaliable = false;
                                result.error = error;
                            });
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
            return './img/fall_track.png';
        } else {
            return addr;
        }
    };
}]);

app.service('nekudoGeoIp', ['$http', '$q', function ($http, $q) {
    var address = 'http://geoip.nekudo.com/api';

    this.getGeoInfo = function () {
        var defer = $q.defer();

        $http.get(address)
            .then(function (data) {
                defer.resolve(getMappedObject(data.data));
            }).catch(function (err) {
                defer.reject(err);
            });
        return defer.promise;
    };

    var getMappedObject = function (data) {
        return {
            "ip": data.ip,
            "country": data.country.name,
            "region": '',
            "city": data.city,
            "timezone": data.country.time_zone
        };
    };
}]);

app.service('freeGeoIp', ['$http', '$q', function ($http, $q) {
    var address = 'http://freegeoip.net/json/';

    this.getGeoInfo = function () {
        var defer = $q.defer();

        getResult().
        then(function (data) {
            defer.resolve(getMappedObject(data.data));
        }).catch(function (err) {
            defer.reject(err);
        });
        return defer.promise;
    };

    var getResult = function () {
        return $http.get(address);
    };

    var getMappedObject = function (data) {
        return {
            "ip": data.ip,
            "country": data.country_name,
            "region": data.region_name,
            "city": data.city,
            "timezone": data.time_zone
        };
    };
}]);

app.service('mongger', ['$http', '$q', function ($http, $q) {
    var address = 'http://mongger-saaka.rhcloud.com';

    this.saveRequestToMongger = function (user, period, geoData) {
        var defer = $q.defer();
        postSpotifm(user, period, geoData)
            .then(function (data) {
                defer.resolve(data);
            }).catch(function (err) {
                defer.resolve(err);
            });
        return defer.promise;
    };

    var postSpotifm = function (user, period, geoData) {
        if (!geoData) {
            return $http.post(address + '/spotifm', {
                "user": user,
                "period": period,
                "ip": "",
                "country": "",
                "region": "",
                "city": "",
                "timezone": ""
            });
        } else {
            return $http.post(address + '/spotifm', {
                "user": user,
                "period": period,
                "ip": geoData.ip,
                "country": geoData.country,
                "region": geoData.region,
                "city": geoData.city,
                "timezone": geoData.timezone
            });
        }
    };
}]);

app.service('spotifyAPI', ['$http', '$q', function ($http, $q) {
    var clientId = '07c0d03f5ac14e6a92f4ec6c456aee61';
    var address = 'https://api.spotify.com/v1/';

    this.getTrackSpotifyData = function (artistName, trackTitle) {
        var defer = $q.defer();
        getTrackSpotifyDataWithLimit(artistName, trackTitle, 1)
            .then(function (data) {
                if (data.isAvaliable) {
                    if (data.trackTitle == trackTitle) {
                        defer.resolve(data);
                    } else {
                        getTrackSpotifyDataWithLimit(artistName, trackTitle, 20)
                            .then(function (data) {
                                defer.resolve(data);
                            })
                            .catch(function (errStatus) {
                                defer.reject(errStatus);
                            });
                    }
                } else {
                    var trackTitleSimple = removeTrackTitleNoise(trackTitle);
                    if (trackTitleSimple == trackTitle) {
                        defer.resolve(data);
                    } else {
                        getTrackSpotifyDataWithLimit(artistName, trackTitleSimple, 20)
                            .then(function (data) {
                                defer.resolve(data);
                            })
                            .catch(function (errStatus) {
                                defer.reject(errStatus);
                            });
                    }
                }
            })
            .catch(function (error) {
                defer.reject(error);
            });

        return defer.promise;
    };

    function getTrackSpotifyDataWithLimit(artistName, trackTitle, limit) {
        var defer = $q.defer();
        getTrackSpotifyDataRequestWithLimit(artistName, trackTitle, limit)
            .success(function (data) {
                var track = {};
                if (data.tracks && data.tracks.items.length) {
                    var bestMatchIndex = 0;
                    if (limit > 1) {
                        for (var index in data.tracks.items) {
                            var temp = data.tracks.items[index];
                            if (temp.name == trackTitle) {
                                bestMatchIndex = index;
                                break;
                            }
                        }
                    }
                    var trackInfo = data.tracks.items[bestMatchIndex];
                    track.trackTitle = track.name;
                    track.spotifyUri = trackInfo.uri;
                    track.spotifyPreview = trackInfo.preview_url;
                    track.isAvaliable = true;
                } else {
                    track.isAvaliable = false;
                }
                defer.resolve(track);
            })
            .error(function (data, status) {
                defer.reject(status);
            });

        return defer.promise;
    }

    function removeTrackTitleNoise(trackTitle) {
        if (trackTitle.indexOf('(') > -1) {
            return trackTitle.split('(')[0].trim();
        } else if (trackTitle.indexOf('[') > -1) {
            return trackTitle.split('[')[0].trim();
        } else if (trackTitle.indexOf('-') > -1) {
            return trackTitle.split('-')[0].trim();
        } else {
            return trackTitle;
        }
    }

    function getTrackSpotifyDataRequestWithLimit(artistName, trackTitle, limit) {
        return $http.get(address +
            'search?q=artist%3A%22' + getArtistNameEncoded(artistName) +
            '%22%20track%3A%22' + getTrackTitleEncoded(trackTitle) +
            '%22&type=track&limit=' + limit);
    }

    var getArtistNameEncoded = function (artistName) {
        return encodeURIComponent(artistName);
    };

    var getTrackTitleEncoded = function (trackTitle) {
        return encodeURIComponent(trackTitle);
    };
}]);