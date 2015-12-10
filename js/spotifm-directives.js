app.directive('periodSelect', function() {
    return {
        templateUrl: 'directives/period-select.html',
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        replace: true,
        link: function (scope, elem, attrs) {
            scope.objectList = [{
                name: 'Select period',
                value: null,
            }, {
                name: 'Overall',
                value: 'overall'
            }, {
                name: 'Last 7 days',
                value: '7day'
            }, {
                name: 'Last month',
                value: '1month'
            }, {
                name: 'Last 3 months',
                value: '3month'
            }, {
                name: 'Last 6 months',
                value: '6month'
            }, {
                name: 'Last year',
                value: '12month'
            } ];
            scope.ngModel = scope.objectList[1].value;
        }
    };
});