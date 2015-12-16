app.directive('topTrackListLastfm', function ($sce) {
    return {
        templateUrl: 'directives/top-track-list-lastfm.html',
        restrict: 'A',
        scope: {
            topTrackList: '=',
            showSpotifyButton: '=',
            songPlaying: '='
        },
        replace: true,
        link: function (scope, elem, atts) {
            if (scope.showSpotifyButton == undefined) {
                scope.showSpotifyButton = true;
            }
            scope.songPlaying = null;

            scope.getTextToCopy = function () {
                var text = '';
                for (var index in scope.topTrackList) {
                    if (scope.topTrackList[index].isAvaliable) {
                        text += scope.topTrackList[index].spotifyUri + '\r\n';
                    }
                }
                return text;
            }
            
            scope.getTrackInfoToCopy = function(track) {
                return track.spotifyUri;
            }

            scope.toggleSongPlaying = function (song) {
                if (scope.songPlaying == null) {
                    scope.songPlaying = song;
                } else {
                    scope.songPlaying = null;
                }
            }
            
            scope.trustSrc = function (song) {
                if (song == null)
                    return "";
                return $sce.trustAsResourceUrl(song);
            };
            
            scope.isPreviewAvaliable = function (track) {
                return track.isAvaliable && track.spotifyPreview != null;
            };
        }
    };
});

app.directive('periodSelectLastfm', function () {
    return {
        templateUrl: 'directives/period-select.html',
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        replace: true,
        link: function (scope, elem, attrs) {
            scope.objectList = [
                //     {
                //     name: 'Select period',
                //     value: null,
                // }, 
                {
                    name: 'Last 7 days',
                    value: '7day'
                }, {
                    name: 'Last month',
                    value: '1month'
                    //    }, {
                    //        name: 'Last 3 months',
                    //        value: '3month'
                }, {
                    name: 'Last 6 months',
                    value: '6month'
                }, {
                    name: 'Last year',
                    value: '12month'
                }, {
                    name: 'Overall',
                    value: 'overall'
                }];
            scope.ngModel = scope.objectList[0];
        }
    };
});

app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});